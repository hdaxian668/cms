<template>
  <div class="login-page">
    <div class="login-border">
      <div class="login-default">
        <p>香港萬客會</p>
        <div class="login-default-right">
         <p>BACKSTAGE MANAGEMENT SYSTEM</p>
         <p>後臺管理系統</p>
        </div>
      </div>
      <div class="login-content">
        <div class="login-content-inner">
          <div class="login-loge-part"></div>
          <p class="login-welcoming">
            <span v-if="userData">{{ userData.name }}</span><br>
            第一次登入重置密碼
          </p>
          <el-form class="login-main-content" :model="user" :rules="rules" ref="user" v-loading="loading">

            <div class="login" align="center">
              <el-form-item>
                <el-input v-model="resetPassword.password" type="password" placeholder="請輸入新密碼"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="resetPassword.confirmPassword" placeholder="請再次輸入新密碼" type="password"></el-input>
              </el-form-item>
              <div style="margin-bottom: 22px;">
                <small>密碼不能為空，8個以上字元組成，當中包括大小寫字母及數字。</small>
              </div>
              <el-form-item>
                <el-button el-button type="danger" class="btn-login"
                  :class="{'btn-login-disabled':resetPassword.password == `` && resetPassword.confirmPassword == ``}"
                  :disabled="resetPassword.password == `` && resetPassword.confirmPassword == ``"
                  @click="submitResetPassword()">
                  確認
                </el-button>
              </el-form-item>
            </div>
            <br>
            <br>
            <br>
            <div>
              <a href="#" class="btn-back" @click="back()">返回</a>
            </div>
            <a href="tel:+85223098888" class="btn-contactus">聯絡我們</a>
          </el-form>
        </div>
      </div>
      <div class="login-footer"></div>
    </div>

  </div>
</template>

<script>
  import {
    baseVanke,
    baseUtil
  } from '@/util/index';
  import { resetPwd, getPublicKey } from '@/api/index';
  export default {
    name: "resetPassword",
    props:{
        'userData':{
          type: Object,
          required: true
        }
    },
    data() {
      return {
        loading: false,
        resetPassword: {
          password: "",
          confirmPassword: "",
        }
      }
    },
    methods: {
      checkPassword(password) {
        const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return pattern.test(password);
      },
      submitResetPassword(){
        const { password,confirmPassword } = this.resetPassword;
        if( !this.checkPassword(password) ||  !this.checkPassword(confirmPassword) ){
          this.$message.error(`密碼不能為空，8個以上字元組成，當中包括大小寫字母及數字。`);
          return false;
        }else if( password != confirmPassword ){
            this.$message.error(`兩次輸入的密碼不一致，請重新輸入。`);
            return false;
        }
        const self = this;
        self.loading = true;
        getPublicKey().then(function(res){
          const pw_hash = baseVanke.elEncryptRSA(res.data.public_key, password);
          resetPwd(pw_hash).then(function() {
            self.$message({
              type: 'success',
              message: '密碼重置成功！'
            });
            self.loading = false;
            self.resetPassword.password = ``;
            self.resetPassword.confirmPassword = ``;
            self.$emit("success");

          }).catch(function(error) {
            self.$message.error(error.message);
            self.loading = false;
          })
        });
      },
      back(){
        this.$emit('logout',true);
      },
    }
  }
</script>

<style lang="less" scoped>
  @bg: #545c64;
  @bg2: #ffffff;
  @text1: #fff;
  @red: #a7161d;
  div {
    box-sizing: border-box;
    width: 100%;
  }
  .el-form-item {
    width: 100%;
    min-width: 20px;
  }
  .login-page {
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    position: fixed;
    top: 0;
    left: 0;
    padding: 4%;
    overflow: scroll;
  }

  .login-border {
    position:relative;
    width: 100%;
    height: 100%;
    min-height: 420px;
    /*min-width: 642px;*/
    box-shadow: 10px 10px 40px 20px rgba(0, 0, 0, .2);
    background-color: rgba(255,255,255,0.1);
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
  }

  .login-default {
    flex: 1;
    position:relative;
    color: @text1;
    margin: 3%;
    font-size: 28px;
    >p {
      font-family: SimHei;
    }
  }
  .login-default-right{
    position: absolute;
    bottom: 10%;
    right: 0;
    font-size: 33px;
    text-align: right;
    line-height: 1.8;
    >p:nth-of-type(2) {
      font-size: 21px;
      font-family: SimHei;
    }
  }
  .login-content {
    width: 28%;
    max-width: 400px;
    background: @bg2;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .login-content-inner {
    width: 80%;
    margin-bottom: 50px;
  }
  .login-loge-part {
    background: url(../../../static/images/vanke-icon.png) no-repeat center;
    background-size: 80%;
    height: 100px;
  }
  .login-welcoming {
    font-size: 21px;
    font-weight: 600;
    background: url(../../../static/images/border.png) no-repeat bottom center;
    background-size: 80px;
    line-height:40px;
  }
  .login-main-content {
    text-align: center;
    margin-top: 40px;
  }
  .el-button {
    width: 100%;
    background: @red;
    border-color:@red;
  }
  .el-button:hover,
  .el-button:focus,
  .el-button:active {
    width: 100%;
    background: @red;
    border-color:@red;
  }
  .login-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    color: #fff;
    text-align: center;
    line-height: 60px;
    font-size: 12px;
    transform:translateY(100%);
  }
  @media screen and (max-width: 700px) {
    .login-content {
      width: 100%;
      max-width: 100%;
    }
    .login-default {
      display: none;
    }
    .login-footer {
      position: relative;
    }
  }
  .type, .mobileotp, .emailotp, .verify, .resend, .back {
    display:none;
  }
  .btn-back {
    color: #666;
  }
  .btn-contactus {
    color: #ccc;
    font-size: 12px;
  }
  .btn-resend-disabled,
  .btn-resend-disabled:hover,
  .btn-resend-disabled:focus,
  .btn-resend-disabled:active {
    color: #666;
  }
  .btn-login-disabled,
  .btn-login-disabled:hover,
  .btn-login-disabled:focus,
  .btn-login-disabled:active {
    background: #999;
    border-color: #999;
  }
  .g-recaptcha {
    margin-bottom: 10px;
  }

</style>



// WEBPACK FOOTER //
// src/components/resetPassword/resetPassword.vue