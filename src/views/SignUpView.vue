<template>
  <div class="body">
    <NavbarComponent />
    <div class="container">
      <div class="row">
        <div class="col form-container">
          <h1 style="font-size: 3rem">Welcome to MindCare community</h1>
          <form>
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" class="form-control" id="username" v-model="username" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" class="form-control" id="email" v-model="email" />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" id="password" v-model="password" />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model="confirmPassword"
              />
            </div>
            <div class="form-group">
              <label for="accountType">Account Type</label>
              <select class="form-control" id="accountType" v-model="accountType">
                <option value="normal">Normal User</option>
                <option value="support">Mental Health Support</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary my-4 btn-login">Sign Up</button>
          </form>
        </div>
        <div class="col sec-col">
          <img :src="SignUpImg" alt="MindCare" class="img-fluid ppl-img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import SignUpImg from '@/assets/images/SignUpImg.png'
import { ref } from 'vue'
const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  accountType: 'normal'
})

const errors = ref({
  username: null,
  email: null,
  password: null,
  confirmPassword: null,
  accountType: null
})

const validateEmail = (blur) => {}
</script>

<style scoped>
.body {
  height: 100vh;
  width: 100%;
  background-color: #2a412b;
}
.form-container {
  margin-top: 4rem;
  color: white;
}

.btn-login {
  background: linear-gradient(to top, #072209, #0e3c1e, #1c6638);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 10px 40px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgb(61, 61, 61, 0.1);
}

.ppl-img {
  width: 70vh;
  height: auto;
  top: 20%;
  left: 60%;
  position: absolute;
}

.sec-col {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
