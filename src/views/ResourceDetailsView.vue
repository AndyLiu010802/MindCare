<template>
  <div class="resource-details">
    <h1>{{ title }}</h1>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <div v-if="explanation">
        <p>{{ explanation }}</p>
        <a v-if="relatedLink" :href="relatedLink" target="_blank">Read More</a>
      </div>
      <div v-else>
        <p>Could not load the explanation. Please try again later.</p>
      </div>
    </div>

    <div v-if="relatedLink">
      <label for="rating">Rate this link:</label>
      <select v-model="rating" id="rating">
        <option value="1">1 - Poor</option>
        <option value="2">2 - Fair</option>
        <option value="3">3 - Good</option>
        <option value="4">4 - Very Good</option>
        <option value="5">5 - Excellent</option>
      </select>
      <button @click="submitRating">Submit Rating</button>
    </div>

    <div v-if="comments.length">
      <h2>User Comments</h2>
      <div v-for="(comment, index) in comments" :key="index">
        <p>{{ comment.content }}</p>
        <p>Rating: {{ comment.rating }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDatabase, ref as dbRef, set, push, onValue } from 'firebase/database'

const route = useRoute()
const title = ref(route.params.title)
const explanation = ref('')
const relatedLink = ref('')
const rating = ref(3)
const comments = ref([])
const loading = ref(true)

const fetchExplanation = async (title) => {
  const url = 'https://chatgpt-42.p.rapidapi.com/conversationgpt4-2'
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': '433ff159abmshcda3627ace83f43p174269jsnc73fa007b9a6',
      'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: `Provide a detailed explanation about ${title} and some related link for further reading.`
        }
      ],
      system_prompt: '',
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false
    })
  }

  try {
    const response = await fetch(url, options)
    if (response.status === 403) {
      console.error('403 Error: Access Forbidden - Check API key or usage limits.')
      loading.value = false
      return
    }
    const result = await response.json()
    console.log('API Response:', result)

    if (result && result.result) {
      explanation.value = result.result
      relatedLink.value = extractLinkFromText(result.result)
    } else {
      console.error('API returned an unexpected structure or empty response.')
    }
  } catch (error) {
    console.error('Error fetching explanation:', error)
  } finally {
    loading.value = false
  }
}

const extractLinkFromText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const match = text.match(urlRegex)
  return match ? match[0] : ''
}

const submitRating = async () => {
  const db = getDatabase()
  const commentsRef = dbRef(db, `comments/${title.value}`)
  const newCommentRef = push(commentsRef)
  await set(newCommentRef, {
    content: explanation.value,
    rating: rating.value,
    link: relatedLink.value
  })
}

const loadComments = async () => {
  const db = getDatabase()
  const commentsRef = dbRef(db, `comments/${title.value}`)
  onValue(commentsRef, (snapshot) => {
    comments.value = []
    snapshot.forEach((childSnapshot) => {
      comments.value.push(childSnapshot.val())
    })
  })
}

onMounted(async () => {
  await fetchExplanation(title.value)
  await loadComments()
})
</script>

<style scoped>
.resource-details {
  padding: 20px;
}
</style>
