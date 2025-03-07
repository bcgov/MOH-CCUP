import axios from "axios";

const SPA_ENV_SERVER_URL = "/ccup/api/env";

/**
 * The list of all server envs we expect back from the spa-env-server. By adding
 * a value here it'll both be retrieved from the server, and the type/interface
 * will be updated.
 */
const serverEnvs = {
  SPA_ENV_CCUP_MAINTENANCE_FLAG: "",
  SPA_ENV_CCUP_MAINTENANCE_START: "",
  SPA_ENV_CCUP_MAINTENANCE_END: "",
  SPA_ENV_CCUP_MAINTENANCE_MESSAGE: "",
  SPA_ENV_CCUP_TIME_FORMAT: "",
};

// Used in HTTP request
const stringifiedEnvs = JSON.stringify(serverEnvs);

/**
 * Responsible for retrieving values from the spa-env-server on OpenShift.
 */
class SpaEnvService {
  constructor() {
    this.values = null;
  }

  loadEnvs() {
    const headers = {
      SPA_ENV_NAME: stringifiedEnvs,
    };
    const axiosPromise = axios.post(SPA_ENV_SERVER_URL, null, {
      headers: headers,
    });
    axiosPromise.then((response) => {
      this.values = response.data;
    });
    return axiosPromise;
  }
}

export default new SpaEnvService();
