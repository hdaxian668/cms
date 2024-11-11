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
          <p class="login-welcoming">歡迎登錄</p>
          <el-form class="login-main-content" :model="user" :rules="rules" ref="user" v-loading="loading">

            <div class="login" align="center">
              <el-form-item prop="name">
                <el-input v-model="user.name" placeholder="賬號"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="user.password" placeholder="密碼"
                          type="password"
                          @keyup.enter.native="userLogin"></el-input>
              </el-form-item>
              <!--<el-form-item >-->
              <!--<el-checkbox v-model="user.rememberMe">記住我</el-checkbox>-->
              <!--</el-form-item>-->

              <el-form-item>
                <div
                  class="g-recaptcha"
                  data-sitekey="6LdGZhcnAAAAABGM4TXiomMCwcwEjNb_jtcaHKtC"
                  data-theme="light" data-size="normal"
                  data-callback="captchaVerify"
                  data-expired-callback="captchaExpired"
                  data-error-callback="captchaError">
                </div>
                <el-button type="primary" class="btn-login btn-login-disabled" @click="userLogin">登錄</el-button>
              </el-form-item>
            </div>

            <div class="type">
              <el-form-item >
                <el-button type="primary" @click="emailotp" class="emailotp"></el-button>
              </el-form-item>
              <el-form-item >
                <el-button type="primary" @click="mobileotp" class="mobileotp"></el-button>
              </el-form-item>
            </div>

            <div class="verify">
              <p>認證</p>
              <p>請輸入您的一次性密碼</p>

              <el-form-item prop="code">
                <el-input v-model="user.code" placeholder="驗證碼"></el-input>
              </el-form-item>

              <el-form-item >
                <el-button type="primary" @click="verify" >確定</el-button>
              </el-form-item>
            </div>

            <div class="resend">
              <a href="#" class="btn-resend" @click="resend">重發</a>
            </div>

            <br>
            <br>
            <br>
            <div class="back">
              <a href="#" class="btn-back" @click="back">返回</a>
            <div>
            <a href="tel:+85223098888" class="btn-contactus">聯絡我們</a>

          </el-form>
        </div>

      </div>
      <div class="login-footer"></div>
    </div>

  </div>
</template>

<script>
  import { login,emailotp,mobileotp,verify } from '@/api/login/login';
  import {
    baseVanke,
    baseUtil
  } from '@/util/index';
  import { getPublicKey } from '@/api/index';
  export default {
    name: "login",
    data() {
      return {
        loading: false,
        rules: {
          name: [
            {required: true, message: '請輸入賬號', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '請輸入密碼', trigger: 'blur'}
          ],
        },
        user: {
          name: '',
          password: '',
          rememberMe: 1, // 保持记住状态
          captcha_token: '',
          code: '',
        },
        timeleft: 30,
        timer: null
      }
    },
    methods: {
      /* 向后端发送用户名和密码，请求登录，登录成功则进入系统 */
      async userLogin() {
        if ($(".btn-login").hasClass('btn-login-disabled')) {
          return;
        }
        const self = this;
        this.$refs.user.validate((valid)=>{
          if(valid) {
            const user = this.user;
            self.loading = true;
            getPublicKey().then(function(res){
              const pw_hash = baseVanke.elEncryptRSA(res.data.public_key, user.password)
              const data = {
                username: user.name,
                // password : user.password,
                password: pw_hash,
                rememberMe: 1,
                captcha_token: user.captcha_token,
              };
              login(data).then(function(info) {
                const email = info.data.email;
                const mobile = info.data.mobile;

                $(".login").hide();
                $(".type").show();
                $(".back").show();

                if(email){
                  $(".emailotp").html(email);
                  $(".emailotp").show();
                }else{
                  $(".emailotp").hide();
                }

                if(mobile){
                  $(".mobileotp").html(mobile);
                  $(".mobileotp").show();
                }else{
                  $(".mobileotp").hide();
                }
                self.loading = false;
              }).catch(function(error){
                self.$message.error(error.message);
                self.loading = false;
              });

            }).catch(function(error){
                self.$message.error(error.message);
                self.loading = false;
            });
          } else {
            return false;
          }
        });
      },
      emailotp(){
        this.user.code = '';

        $(".type").hide();
        $(".verify").show();
        this.startResendTimer();

        const data = {
          username: this.user.name,
          otpType: 'email',
        };
        emailotp(data).then(function(info) {
          // ...
        }).catch(function(error){

        });
      },
      mobileotp(){
        this.user.code = '';

        $(".type").hide();
        $(".verify").show();
        this.startResendTimer();

        const data = {
          username: this.user.name,
          otpType: 'mobile',
        };
        mobileotp(data).then(function(info) {
          // ...
        }).catch(function(error){

        });
      },
      verify(){
        const self = this;
        const user = this.user;
        self.loading = true;
        getPublicKey().then(function(res){
          const pw_hash = baseVanke.elEncryptRSA(res.data.public_key, user.password);
          const data = {
            code: user.code,
            username: user.name,
            password : pw_hash,
            rememberMe: 1,
          };
          verify(data).then(function(info) {
            self.loading = false;
            self.$emit('logined');
          }).catch(function(error){
            self.$message.error(error.message);
            self.loading = false;
          });
        })
      },
      resend(){
        if ($(".btn-resend").hasClass('btn-resend-disabled')) {
          return;
        }
        $(".type").show();
        $(".verify").hide();
        $(".resend").hide();
        $(".btn-resend").addClass('btn-resend-disabled');
        $(".btn-resend").click(false);
      },
      resendTimer(){
        if(this.timeleft <= 0){
          clearInterval(this.timer);
          $(".btn-resend").html('重發');
          $(".btn-resend").removeClass('btn-resend-disabled');
          return;
        }
        $(".btn-resend").html('重發('+this.timeleft+'s)');
        this.timeleft -= 1;
      },
      startResendTimer() {
        this.timeleft = 30;
        clearInterval(this.timer);
        $(".resend").show();
        $(".btn-resend").addClass('btn-resend-disabled');
        this.timer = setInterval(this.resendTimer, 1000);
      },
      back(){
        location.reload();
      },
      captchaVerify(response){
        this.user.captcha_token = response;
        $(".btn-login").removeClass('btn-login-disabled');
      },
      captchaExpired(response){

      },
      captchaError(response){
        console.log(response);
      }
    },
    mounted: function() {
      window.captchaVerify = this.captchaVerify;
      window.captchaExpired = this.captchaExpired;
      window.captchaError = this.captchaError;
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
// src/components/login/login.vue