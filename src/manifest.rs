use serde::{Deserialize, Serialize};
use thiserror::Error;
use crate::constants::Implementation;

#[derive(Error, Debug)]
pub enum MergeManifestError {
    #[error("Source in manifest not found")]
    SourceNotFound,
    #[error("Project in manifest not found")]
    ProjectNotFound,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Workflow {
    pub format: Option<String>,
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    validation: Option<String>,
    jobs: serde_json::Value,
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
    pub fn merge(self, custom: Manifest) -> Result<Manifest, MergeManifestError> {
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
            Some(s) => Some(Source {
                schema: s.schema.or(default_source.schema),
                module: s.module.or(default_source.module),
                import_abis: s.import_abis.or(default_source.import_abis)
            }),
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
        implementation: &Implementation<'_>,
    ) -> Manifest {
        Manifest {
            format: Some("0.2.0".to_string()),
            project: Some(Project {
                name: Some(feature.to_string()),
                _type: Some(format!("wasm/{}", &implementation.name.to_string())),
            }),
            source: Some(Source {
                schema: Some("../../schema.graphql".to_string()),
                module: Some(implementation.module.to_string()),
                import_abis: None,
            })
        }
    }
}