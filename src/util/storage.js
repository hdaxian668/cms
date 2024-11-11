export default {
  /**
   * 保存用户信息
   * @param user - 用户
   */
  save(user) {
    localStorage.setItem('f-user', JSON.stringify(user));
  },
  /**
   * 读取用户信息
   * @returns
   */
  read() {
    return {
      user: JSON.parse(localStorage.getItem('f-user')),
    }
  },
  /**
   * 清空用户信息
   */
  remove() {
    localStorage.removeItem('f-user');
  }
}



// WEBPACK FOOTER //
// ./src/util/storage.js