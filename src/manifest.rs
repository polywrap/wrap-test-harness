use std::collections::HashMap;
use std::{env, fs};
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use crate::constants::Implementation;
use crate::error::{MergeManifestError};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Workflow {
    pub format: Option<String>,
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    validation: Option<String>,
    pub jobs: serde_json::Value,
}

pub type ImportAbis = Vec<ImportAbi>;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct ImportAbi {
    uri: String,
    abi: String,
}

#[derive(Default, Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Project {
    name: Option<String>,
    #[serde(rename = "type")]
    _type: Option<String>,
}

#[derive(Default, Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Source {
    schema: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    module: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    import_abis: Option<ImportAbis>,
}

#[derive(Default, Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Manifest {
    pub format: Option<String>,
    pub project: Option<Project>,
    pub source: Option<Source>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extensions: Option<HashMap<String, String>>
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct RsImage {
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct AsImage {
    pub include: Vec<String>,
    pub node_version: String
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(untagged)]
pub enum Image {
    Rs(RsImage),
    As(AsImage)
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Strategies {
    image: Image
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct BuildManifest {
    pub format: String,
    pub strategies: Strategies,
    pub linked_packages: Vec<HashMap<String, String>>
}

impl Strategies {
    pub fn rs() -> Self {
        Strategies {
            image: Image::Rs(RsImage {
                name: "test".to_string()
            })
        }
    }

    pub fn assemblyscript() -> Self {
        Strategies {
            image: Image::As(AsImage {
                node_version: "16.13.0".to_string(),
                include: vec!["./package.json".to_string()]
            })
        }
    }
}

impl BuildManifest {
    pub fn generate(manifest_path: PathBuf, dependency_path: String, implementation: String) {
        let path = manifest_path.join("polywrap.build.yaml");
        let (strategies, name) = match implementation.as_str() {
            "as" => (Strategies::assemblyscript(), "@polywrap/wasm-as"),
            "rs" => (Strategies::rs(), "polywrap-wasm-rs"),
            _ => {
                panic!("unknown implementation")
            }
        };

        let mut wasm_package: HashMap<String, String> = HashMap::new();
        wasm_package.insert("name".to_string(), name.to_string());
        wasm_package.insert("path".to_string(), format!("{dependency_path}/{implementation}"));
        let linked_packages: Vec<HashMap<String, String>> = vec![wasm_package];

        let build_manifest = BuildManifest {
            format: "0.2.0".to_string(),
            strategies,
            linked_packages
        };

        let f = fs::OpenOptions::new()
            .write(true)
            .create(true)
            .open(path).unwrap();

        serde_yaml::to_writer(f, &build_manifest).unwrap();

        // Add the polywrap.build.yaml manifest to the polywrap.yaml's extensions.build property
        let mp = manifest_path.join("polywrap.yaml");
        let mf = fs::OpenOptions::new()
            .read(true)
            .open(mp.clone()).unwrap();

        let mut manifest: Manifest = serde_yaml::from_reader(mf).unwrap();
        let mut extensions = HashMap::new();
        extensions.insert("build".to_string(), "./polywrap.build.yaml".to_string());
        manifest.extensions = Some(extensions);

        let mf = fs::OpenOptions::new()
            .write(true)
            .open(mp).unwrap();

        serde_yaml::to_writer(mf, &manifest).unwrap();
    }
}

impl Manifest {
    pub fn merge(self, custom: Manifest, implementation: Option<&str>) -> Result<Manifest, MergeManifestError> {
        let default_project = self.project.ok_or(MergeManifestError::ProjectNotFound)?;

        let project  = match custom.project {
            Some(p) => Some(Project {
                name: p.name.or(default_project.name),
                _type: p._type.or(default_project._type),
            }),
            _ => Some(default_project)
        };

        let default_source = self.source.ok_or(MergeManifestError::SourceNotFound)?;

        let source = match custom.source {
            Some(s) => {
                let mut abis = default_source.import_abis;
                if let Some(import_abis) = s.import_abis {
                    if let Some(i) = implementation {
                        let imports = import_abis.iter().map(|import_abi| {
                            let mut abi_path: String = import_abi.clone().abi;
                            if abi_path.contains("${implementation}") {
                                abi_path = abi_path.replace("${implementation}", i);
                            } else if !(
                                abi_path.ends_with("wrap.info") || abi_path.ends_with(".graphql")
                            ) {
                                let abi = Path::new(&abi_path).join("implementations")
                                    .join(i)
                                    .join("build/wrap.info");
                                abi_path = abi.to_str().unwrap().to_string();
                            }

                            ImportAbi {
                                uri: import_abi.clone().uri,
                                abi: abi_path
                            }
                        }).collect::<ImportAbis>();
                        abis = Some(imports);
                    }
                }

                let source = Source {
                    schema: s.schema.or(default_source.schema),
                    module: s.module.or(default_source.module),
                    import_abis: abis
                };
                Some(source)
            },
            _ => Some(default_source)
        };

        let mut extensions = None;
        if env::var("POLYWRAP_WASM_PATH").is_ok() {
             let mut e = HashMap::new();
            e.insert("build".to_string(), "./polywrap.build.yaml".to_string());
            extensions = Some(e)
        }

        Ok(Self {
            format: self.format,
            project,
            source,
            extensions
        })
    }

    pub fn default(
        feature: &str,
        implementation: &Option<&Implementation<'_>>,
    ) -> Manifest {
        let (module, schema, _type) = match implementation {
            Some(i) => {
                (
                    Some(i.module.to_string()),
                    Some("../../schema.graphql".to_string()),
                    Some(format!("wasm/{}", i.name))
                )
            },
            None => (None, Some("./schema.graphql".to_string()), Some("interface".to_string()))
        };
        Manifest {
            format: Some("0.5.0".to_string()),
            project: Some(Project {
                name: Some(feature.to_string()),
                _type,
            }),
            source: Some(Source {
                schema,
                module,
                import_abis: None,
            }),
            extensions: None
        }
    }
}