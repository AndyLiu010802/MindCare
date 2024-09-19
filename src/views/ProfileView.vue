<template>
  <div class="body">
    <NavbarComponent />
    <div v-if="authState.isAuthenticated" class="container">
      <div class="">
        <p>Username: {{ username }}</p>
        <p>Email: {{ email }}</p>
      </div>
    </div>
    <div class="button-group">
      <button
        v-if="authState.isAuthenticated"
        type="button"
        class="btn btn-primary"
        @click="logout"
      >
        Log out
      </button>
      <button
        v-if="authState.isAuthenticated"
        type="button"
        class="btn btn-danger"
        @click="deleteAccount"
      >
        Delete Account
      </button>
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import { signOut, deleteUser } from 'firebase/auth'
import { auth } from '@/firebase'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { authState } from '@/store'
import { ref, onMounted } from 'vue'

// Initialize Firestore
const db = getFirestore()

const router = useRouter()
const username = ref('')
const email = ref('')

const getUserDoc = async () => {
  if (authState.user) {
    email.value = authState.user.email

    if (authState.accountType === 'normal') {
      const userDocRef = doc(db, 'Users', authState.user.uid)
      try {
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          const data = userDocSnap.data()
          username.value = data.username
        } else {
          console.error('User document does not exist!')
        }
      } catch (error) {
        console.error('Error fetching user document:', error)
      }
    } else if (authState.accountType === 'support') {
      const supDocRef = doc(db, 'Psychologists', authState.user.uid)
      try {
        const supDocSnap = await getDoc(supDocRef)
        if (supDocSnap.exists()) {
          const data = supDocSnap.data()
          username.value = data.username
        } else {
          console.error('Psychologist document does not exist!')
        }
      } catch (error) {
        console.error('Error fetching psychologist document:', error)
      }
    }
  }
}

const logout = async () => {
  try {
    await signOut(auth)
    authState.user = null
    authState.isAuthenticated = false
    console.log('User signed out successfully')
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

const deleteAccount = async () => {
  const user = auth.currentUser
  if (user) {
    try {
      await deleteUser(user)
      authState.user = null
      authState.isAuthenticated = false
      console.log('User account deleted successfully')
      router.push({ name: 'home' })
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        console.error('Error deleting account: Requires recent login')
        alert('Please log out and log back in, then try deleting your account again.')
      } else {
        console.error('Error deleting account:', error)
      }
    }
  }
}

onMounted(() => {
  getUserDoc()
})
</script>

<style scoped>
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

.button-group {
  display: flex;
  gap: 10px;
}

.btn {
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
