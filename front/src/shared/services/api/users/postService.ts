import { Environment } from '../../../environment';

import axios from 'axios';

class Post {
  create(formData: FormData) {
    const url = Environment.URL_BASE;
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    return axios.post(url, formData, config);
  }
}

export default new Post();
