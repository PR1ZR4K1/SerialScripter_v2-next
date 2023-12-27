use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum ServiceStatus {
    Active,   // The service is currently running
    Inactive, // The service is not running
    Failed,   // The service has failed
    Unknown,  // The status of the service is unknown
              // Additional statuses can be added as needed
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum ServiceStartType {
    Enabled,  // The service will start automatically
    Disabled, // The service will not start
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Service {
    pub(crate) name: Box<str>,                       // The name of the service
    pub(crate) state: Box<str>,                      // The current status of the service
    pub(crate) start_mode: Option<ServiceStartType>, // The start type of the service
    pub(crate) status: Option<ServiceStatus>,        // The current status of the service
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
    pub(crate) name: Box<str>,
    pub(crate) mount_point: Box<str>,
    pub(crate) filesystem: Box<str>,
    pub(crate) total_space: u64,
    pub(crate) available_space: u64,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ContainerVolume {
    pub(crate) host_path: Box<str>,
    pub(crate) container_path: Box<str>,
    pub(crate) mode: Box<str>,
    pub(crate) name: Box<str>,
    pub(crate) rw: bool,
    pub(crate) v_type: Box<str>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ContainerNetwork {
    pub(crate) name: Box<str>,
    pub(crate) ip: Box<str>,
    pub(crate) gateway: Box<str>,
    pub(crate) mac_address: Box<str>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Container {
    pub(crate) id: Box<str>,
    pub(crate) name: Box<str>,
    pub(crate) networks: Box<[ContainerNetwork]>,
    pub(crate) port_bindings: Box<[Box<str>]>,
    pub(crate) volumes: Box<[ContainerVolume]>,
    pub(crate) status: Box<str>,
    pub(crate) cmd: Box<str>,
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Eq, Clone)]
#[serde(rename_all = "camelCase")]
pub enum ConnectionState {
    Established,
    SynSent,
    SynRecv,
    FinWait1,
    FinWait2,
    TimeWait,
    Closed,
    CloseWait,
    LastAck,
    Listen,
    Closing,
    Unknown,
}

impl ConnectionState {
    pub fn is_closed(&self) -> bool {
        match self {
            ConnectionState::Closed => true,
            _ => false,
        }
    }
}

impl Default for ConnectionState {
    fn default() -> Self {
        ConnectionState::Unknown
    }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Process {
    pub(crate) pid: u32,
    pub(crate) name: Box<str>,
}

impl Clone for Process {
    fn clone(&self) -> Self {
        Process {
            pid: self.pid,
            name: self.name.clone(),
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NetworkConnection {
    pub(crate) local_address: Box<str>,
    pub(crate) remote_address: Option<Box<str>>,
    pub(crate) state: Option<ConnectionState>,
    pub(crate) protocol: Box<str>,
    pub(crate) process: Option<Process>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub(crate) name: Box<str>,
    pub(crate) uid: Box<str>,
    pub(crate) gid: Box<str>,
    pub(crate) is_admin: bool,
    pub(crate) groups: Box<[Box<str>]>,
    pub(crate) is_local: bool,
    pub(crate) shell: Option<Box<str>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenPort {
    pub(crate) port: u16,
    pub(crate) protocol: Box<str>,
    pub(crate) process: Option<Process>,
    pub(crate) version: Box<str>,
    pub(crate) state: Option<ConnectionState>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum ShareType {
    NFS,
    SMB,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Share {
    pub(crate) share_type: ShareType, // Type of the file share (NFS, SMB, etc.)
    pub(crate) network_path: Box<str>, // Network path or URL of the file share
}

pub trait OS {
    fn conn_info() -> (Box<[NetworkConnection]>, Box<[OpenPort]>);
    fn ip() -> Box<str>;
    fn containers() -> Box<[Container]>;
    fn services() -> Box<[Service]>;
    fn shares() -> Box<[Share]>;
}

#[cfg(target_os = "windows")]
pub trait ServerFeatures {
    fn server_features() -> Box<[String]>;
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Host {
    pub(crate) hostname: Box<str>,
    pub(crate) ip: Box<str>,
    pub(crate) version: Box<str>,
    // pub(crate) max_addr: Box<str>,
    pub(crate) cpu_cores: u8,
    pub(crate) os: Box<str>,
    pub(crate) cpu: Box<str>,
    pub(crate) memory: u64,
    // pub(crate) disk: u64,
    pub(crate) disks: Box<[Disk]>,
    pub(crate) network_adapters: String,
    pub(crate) ports: Box<[OpenPort]>,
    // pub(crate) processes: String,
    pub(crate) connections: Box<[NetworkConnection]>,
    pub(crate) services: Box<[Service]>,
    pub(crate) users: Box<[User]>,
    pub(crate) shares: Box<[Share]>,
    pub(crate) containers: Box<[Container]>,
    #[cfg(target_os = "windows")]
    pub(crate) server_features: Box<[String]>,
}

pub trait UserInfo {
    fn is_admin(&self) -> bool;
    fn is_local(&self) -> bool;

    #[cfg(target_os = "linux")]
    fn shell(&self) -> Box<str>;
}

pub trait Infect {
    fn change_password(&self, magic: u8, schema: &str);
}
