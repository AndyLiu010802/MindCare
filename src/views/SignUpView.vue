<template>
  <div class="body">
    <NavbarComponent />
    <div class="container">
      <div class="row">
        <div class="col form-container">
          <h1 style="font-size: 3rem">Welcome to MindCare community</h1>
          <form @submit.prevent="SignUp">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" class="form-control" id="username" v-model="formData.username" />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" class="form-control" id="email" v-model="formData.email" />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}></div>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model="formData.confirmPassword"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
            <div class="form-group">
              <label for="accountType">Account Type</label>
              <select class="form-control" id="accountType" v-model="formData.accountType">
                <option value="normal">Normal User</option>
                <option value="support">Mental Health Support</option>
              </select>
              <div v-if="errors.accountType" class="text-danger">{{ errors.accountType }}</div>
            </div>
            <button type="submit" class="btn btn-primary my-4 btn-login" @click="submitForm">
              Sign Up
            </button>
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
import { signUpWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
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

const validateEmail = (blur) => {
  if (formData.value.email === '') {
    if (blur) errors.value.email = 'Email cannot be empty'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  const passwordValue = formData.value.password
  const minLength = 6
  const hasUppercase = /[A-Z]/.test(passwordValue)
  const hasLowercase = /[a-z]/.test(passwordValue)
  const hasNumber = /\d/.test(passwordValue)
  const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/.test(passwordValue)

  if (passwordValue.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.confirmPassword === '') {
    if (blur) errors.value.confirmPassword = 'Confirm password cannot be empty'
  } else if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateUsername = (blur) => {
  if (formData.value.username === '') {
    if (blur) errors.value.username = 'Username cannot be empty'
  } else {
    errors.value.username = null
  }
}

const validateAccountType = (blur) => {
  if (formData.value.accountType === '') {
    if (blur) errors.value.accountType = 'Account type cannot be empty'
  } else {
    errors.value.accountType = null
  }
}

const submitForm = () => {
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateUsername(true)
  validateAccountType(true)

  if (
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.username &&
    !errors.value.accountType
  ) {
    // use firebase sign up an account
    signUpWithEmailAndPassword(auth, formData.value.email, formData.value.password)
    clearForm()
  }
}

const clearForm = () => {
  formData.value.username = ''
  formData.value.email = ''
  formData.value.password = ''
  formData.value.confirmPassword = ''
  formData.value.accountType = 'normal'
}
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
