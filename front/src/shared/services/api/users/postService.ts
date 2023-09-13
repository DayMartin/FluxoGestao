// postService.ts

import axios from 'axios';

class Post {
  create(formData: FormData) {
    const url = "http://localhost:3048/api/users";
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    return axios.post(url, formData, config);
  }
}

export default new Post();
