use std::path::Path;
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

                            return ImportAbi {
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

        Ok(Self {
            format: self.format,
            project,
            source
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
            format: Some("0.2.0".to_string()),
            project: Some(Project {
                name: Some(feature.to_string()),
                _type,
            }),
            source: Some(Source {
                schema,
                module,
                import_abis: None,
            })
        }
    }
}