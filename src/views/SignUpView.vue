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
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="formData.username"
                @blur="() => validateUsername(true)"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="formData.email"
                @blur="() => validateEmail(true)"
              />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
                @blur="() => validatePassword(true)"
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
                @blur="() => validateConfirmPassword(true)"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
            <div class="form-group">
              <label for="accountType">Account Type</label>
              <select
                class="form-control"
                id="accountType"
                v-model="formData.accountType"
                @blur="() => validateAccountType(true)"
              >
                <option value="normal">Normal User</option>
                <option value="support">Mental Health Support</option>
              </select>
              <div v-if="errors.accountType" class="text-danger">{{ errors.accountType }}</div>
            </div>
            <div v-if="formData.accountType == 'support'" class="form-group">
              <label for="license">
                License
                <span class="tooltip-icon" data-tooltip="Ahpra registration number">?</span>
              </label>
              <input type="text" class="form-control" id="license" v-model="formData.license" />
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
import { useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import SignUpImg from '@/assets/images/SignUpImg.png'
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
import axios from 'axios'

const router = useRouter()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  accountType: 'normal',
  license: ''
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

const submitForm = async () => {
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
    if (formData.value.accountType === 'support') {
      await checkLicense()
    } else {
      createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
        .then(() => {
          clearForm()
          router.push({ name: 'home' })
        })
        .catch((error) => {
          console.error('Error creating user:', error)
        })
    }
  }
}

const clearForm = () => {
  formData.value.username = ''
  formData.value.email = ''
  formData.value.password = ''
  formData.value.confirmPassword = ''
  formData.value.accountType = 'normal'
}

const checkLicense = async () => {
  if (!formData.value.license) {
    alert('Please enter a license number.')
    return
  }

  try {
    const soapRequest = `
      <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://ns.ahpra.gov.au/pie/xsd/common/CommonCoreElements/2.0.0" xmlns:ns1="http://ns.ahpra.gov.au/pie/svc/frs/FindRegistration/2.0.0" xmlns:ns2="http://ns.ahpra.gov.au/pie/xsd/frs/FindRegistrationMessages/2.0.0">
        <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
          <ns:LoginDetails>
            <ns:UserId>piews-prod@amgen.org.au</ns:UserId>
            <ns:Password>xC#36kF$4</ns:Password> 
          </ns:LoginDetails>
          <wsa:Action>http://ns.ahpra.gov.au/pie/svc/frs/FindRegistration/2.0.0/FindRegistrationPortType/FindRegistrationsRequest</wsa:Action>
          <wsa:To>https://ws2.ahpra.gov.au/pie/svc/PractitionerRegistrationSearch/2.0.0/FindRegistrationService.svc</wsa:To>
        </soap:Header>
        <soap:Body>
          <ns1:FindRegistrations>
            <ns2:ProfessionNumber>${formData.value.license}</ns2:ProfessionNumber>
          </ns1:FindRegistrations>
        </soap:Body>
      </soap:Envelope>
    `

    const response = await axios.post(
      '/api/pie/svc/PractitionerRegistrationSearch/2.0.0/FindRegistrationService.svc',
      soapRequest,
      {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8'
        }
      }
    )

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(response.data, 'text/xml')

    const professionElement = xmlDoc.getElementsByTagName('Profession')[0]
    const registrationToDateElement = xmlDoc.getElementsByTagName('RegistrationToDate')[0]

    if (!professionElement || !registrationToDateElement) {
      alert('Unable to retrieve necessary data from the response.')
      return
    }

    const profession = professionElement.textContent
    const registrationToDate = registrationToDateElement.textContent
    const currentDate = new Date()
    const expiryDate = new Date(registrationToDate)

    if (profession.includes('Psychologist')) {
      if (expiryDate >= currentDate) {
        createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
          .then(() => {
            clearForm()
            router.push({ name: 'home' })
          })
          .catch((error) => {
            console.error('Error creating user:', error)
          })
      } else {
        alert(
          'The license is valid and the profession is Psychologist, but the registration has expired.'
        )
      }
    } else {
      alert('The profession associated with this license is not Psychologist.')
    }
  } catch (error) {
    console.error('Error checking license:', error)
    alert('There was an error validating the license. Please try again later.')
  }
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

.tooltip-icon {
  position: relative;
  display: inline-block;
  margin-left: 5px;
  color: #ffffff;
  cursor: pointer;
  font-weight: bold;
}

.tooltip-icon::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  font-size: 0.9rem;
  transition: opacity 0.3s;
  pointer-events: none;
}

.tooltip-icon:hover::after {
  opacity: 1;
  visibility: visible;
}
</style>
