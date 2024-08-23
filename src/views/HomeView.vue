<template>
  <div class="body">
    <NavbarComponent />
    <div class="bg-container">
      <img :src="HomepageBg" alt="Homepage background" class="bg-image" />
      <button
        type="button"
        class="btn-join btn btn-primary"
        data-toggle="modal"
        data-target="#loginModal"
      >
        Join Us Now
      </button>
      <!-- Dialog model here -->
      <div
        class="modal fade"
        id="loginModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header d-flex justify-content-between">
              <img
                :src="logo"
                alt="MindCare Logo"
                class="img-fluid"
                style="max-width: 50px; height: auto"
              />
              <h5 class="modal-title" id="loginModalLabel">MindCare</h5>

              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="clearInput"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="login">
                <div class="form-group">
                  <label for="email" class="col-form-label d-flex justify-content-start"
                    >Email:</label
                  >
                  <input
                    v-model="email"
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div class="form-group">
                  <label for="password" class="col-form-label d-flex justify-content-start"
                    >Password:</label
                  >
                  <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="Enter your password"
                    @blur="() => validatePassword(true)"
                  />
                  <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
                  <div v-if="errorMessage" class="text-danger">{{ errorMessage }}</div>
                </div>

                <div class="form-group d-flex justify-content-center">
                  <button type="submit" class="btn btn-primary mx-3 my-2 btn-login">Login</button>
                </div>
                <p class="text-center">Don't have an account? <a href="/signup">Sign up</a></p>
                <a @click="forgotPassword" class="text-center">Forgot password?</a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Card content here -->
    <div class="content-container">
      <div class="row d-flex justify-content-between px-5">
        <CardItem
          title="Welcome"
          content="At MindCare, we understand the pressures of modern life and the impact they can have on mental health. Our platform is dedicated to providing professional mental health support and information"
          color="#C3855F"
          :image="AboutCard"
          navTitle="About"
          link="/about"
        />
        <CardItem
          title="User-Friendly"
          content="Whether you're looking for treatment options, mental health resources, or simply seeking knowledge, MindCare is your go-to platform. Our site is tailored to meet the needs of a diverse audience"
          color="#4D3725"
          :image="ResourceCard"
          navTitle="Resources"
          link="/resources"
        />
        <CardItem
          title="A Safe Space"
          content="We emphasize the importance of community support, connecting users with volunteer psychology therapists who are here to help."
          color="#344451"
          :image="ConsultationCard"
          navTitle="Consultation"
          link="/consultation"
        />
        <CardItem
          title="Reliable"
          content="Trust and reliability are at the core of MindCare. All volunteer therapists on our platform are required to provide legal evidence of their qualifications, ensuring that you receive help from certified professionals. "
          color="#405E44"
          :image="DataCard"
          navTitle="Data"
          link="/statistics"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import HomepageBg from '@/assets/images/HomepageBg.png'
import CardItem from '@/components/CardItem.vue'
import DataCard from '@/assets/images/DataCard.png'
import AboutCard from '@/assets/images/AboutCard.png'
import ResourceCard from '@/assets/images/ResourceCard.png'
import ConsultationCard from '@/assets/images/ConsultationCard.png'
import logo from '@/assets/logo.png'
import { ref } from 'vue'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const errors = ref({
  password: null
})

const login = async () => {
  validatePassword(true)
  if (!errors.value.password) {
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value)
    } catch (error) {
      errorMessage.value = 'Incorrect email or password. Please try again.'
    }
  }
}

// Implement forgot password functionality here
const forgotPassword = async () => {
  try {
    await sendPasswordResetEmail(auth, email.value)
  } catch (error) {
    errorMessage.value = 'Failed to send password reset email. Please try again.'
  }
}

const clearInput = () => {
  email.value = ''
  password.value = ''
  errorMessage.value = ''
}

const validatePassword = (blur) => {
  const passwordValue = password.value
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
</script>

<style scoped>
a {
  cursor: pointer;
}
.bg-container {
  position: relative;
  text-align: center;
  height: 40vh;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn-login {
  background: linear-gradient(to top, #072209, #0e3c1e, #1c6638);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}
.btn-join {
  width: 200px;
  height: 60px;
  font-size: 1.5rem;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(to top, #072209, #0e3c1e, #1c6638);
  color: #fff;
  border-radius: 50px;
  border: none;
  outline: none;
  cursor: pointer;
  position: absolute;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 1;
}

.btn-join:hover {
  color: #fff;
  text-shadow:
    0 0 20px rgba(255, 255, 255, 0.8),
    0 0 30px rgba(255, 255, 255, 0.6),
    0 0 40px rgba(255, 255, 255, 0.5),
    0 0 50px rgba(255, 255, 255, 0.4),
    0 0 60px rgba(255, 255, 255, 0.3);
  transition: text-shadow 0.2s ease-in-out;
}

.content-container {
  padding: 2rem 0;
}

@media (min-width: 1200px) {
  .body {
    background-color: #2a412b;
    height: 100vh;
    overflow: hidden;
  }
}

@media (max-width: 1199.8px) {
  .body {
    background-color: #2a412b;
    height: 100vh;
    overflow-y: scroll;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
