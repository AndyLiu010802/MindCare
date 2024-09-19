<template>
  <div class="body">
    <NavbarComponent class="sticky-top" />
    <h1 class="text-center mt-5">Consultation Team</h1>
    <table class="table">
      <thead>
        <tr>
          <th>Avatar</th>
          <th>Name</th>
          <th>Email</th>
          <th>Rating</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="psychologist in psychologists" :key="psychologist.id">
          <td>
            <img :src="psychologist.avatarUrl" alt="Avatar" class="avatar-img" />
          </td>
          <td>{{ psychologist.username }}</td>
          <td>{{ psychologist.email }}</td>
          <td>{{ psychologist.rating }}</td>
          <td>
            <button class="btn btn-primary" @click="makeAppointment(psychologist)">
              Make an Appointment
            </button>
            <button class="btn btn-secondary" @click="sendEmail(psychologist.email)">
              Send Email
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import NavbarComponent from '@/components/NavbarComponent.vue'

const psychologists = ref([])

const fetchPsychologists = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'Psychologists'))
    psychologists.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching psychologists:', error)
  }
}

const makeAppointment = (psychologist) => {
  console.log('Making appointment with:', psychologist.name)
}

const sendEmail = (email) => {
  window.location.href = `mailto:${email}`
}

onMounted(() => {
  fetchPsychologists()
})
</script>

<style scoped>
.avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.body {
  height: 100vh;
  overflow-x: hidden;
  background-color: #5e91ce;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem !important;
  }

  .container {
    padding: 30px;
  }
}
@media (max-width: 1199.8px) {
  .body {
    overflow-y: scroll;
  }
}

.btn {
  background: linear-gradient(to top, #072209, #0e3c1e, #1c6638);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 10px 40px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgb(61, 61, 61, 0.1);
}
</style>
