<template>
  <div class="body">
    <NavbarComponent class="sticky-top" />
    <div class="row">
      <div class="col-md-2 col-sm-6 col-xs-12 menu-container">
        <div class="link-container mt-5 ps-3">
          <a class="return-a" @click="navigateToResource">Go back</a>
        </div>
        <div class="vertical-line"></div>
      </div>
      <div class="col-md-9 col-sm-6 col-xs-12 mb-2 resource-details">
        <h1>{{ title }}</h1>
        <div v-if="loading">
          <p>Loading...</p>
        </div>
        <div v-else>
          <div v-if="relatedLink">
            <div class="d-flex justify-content-between">
              <div class="sub-title">View the recommended website:</div>
              <button @click="fetchOtherLink" class="btn btn-primary btn-refresh">
                Get a new link
              </button>
            </div>
            <a :href="relatedLink" class="mr-5" target="_blank">{{ relatedLink }}</a>
          </div>
          <div v-else>
            <p>Could not load the website. Please try again later.</p>
          </div>
          <div class="divider"></div>
          <div
            v-if="authState.isAuthenticated"
            class="d-flex justify-content-between px-4 align-items-center send-rating"
          >
            <div>{{ userName }}</div>
            <div>
              <StarRate :initialRating="resetRatingValue" @rating-selected="onRatingSelected" />
            </div>
            <div class="form-group d-flex align-items-center">
              <label for="comment">Comment:</label>
              <textarea class="form-control m-2" id="comment" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-refresh" @click="submitRating">
              Submit
            </button>
          </div>
          <div v-if="authState.isAuthenticated" class="divider"></div>

          <div v-for="(rating, index) in ratings" :key="index" class="rating-item mt-4">
            <div>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ rating.username }}</strong>
                </div>

                <a :href="rating.link" target="_blank" rel="noopener noreferrer">
                  <button class="btn btn-primary btn-refresh">Open Link</button>
                </a>
              </div>
              <div>{{ rating.comment }}</div>
              <div class="text-secondary">{{ rating.date }}</div>
              <div class="divider"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import { authState } from '@/store'
import { db } from '@/firebase'
import { doc, collection, getDoc, getDocs, setDoc } from 'firebase/firestore'
import StarRate from '@/components/StarRate.vue'

const route = useRoute()
const title = ref(route.params.title)
const relatedLink = ref('')
const loading = ref(true)
const router = useRouter()
const userName = ref('')
const rating = ref(0)
const resetRatingValue = ref(0)
const ratings = ref([])

const navigateToResource = () => {
  router.push({ name: 'resources' })
}

async function getCurrentUserName() {
  if (authState.user) {
    let userDocRef
    if (authState.accountType === 'normal') {
      userDocRef = doc(db, 'Users', authState.user.uid)
    } else if (authState.accountType === 'support') {
      userDocRef = doc(db, 'Psychologists', authState.user.uid)
    }

    if (userDocRef) {
      try {
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const userData = userDoc.data()
          return userData.username || 'Anonymous'
        }
      } catch (error) {
        console.error('Error fetching user document:', error)
      }
    }
  }

  return 'Anonymous'
}

const fetchGoogleSearchLink = async (query) => {
  const url = `https://google-search74.p.rapidapi.com/?query=${encodeURIComponent(query)}&limit=10&related_keywords=true`
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '41a6fc23dcmsh243b757ae06a351p17d0fbjsn55ac9d37ee0a',
      'x-rapidapi-host': 'google-search74.p.rapidapi.com'
    }
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()
    console.log('Google Search API Response:', result)

    if (result && result.results && result.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * result.results.length)
      return result.results[randomIndex].url
    } else {
      console.error('No search results found.')
      return null
    }
  } catch (error) {
    console.error('Error fetching Google search link:', error)
    return null
  }
}

const fetchOtherLink = async () => {
  relatedLink.value = await fetchGoogleSearchLink(title.value + ' mental health')
}

const fetchRatings = async () => {
  if (!title.value) {
    console.error('Error: title.value is undefined or empty.')
    return
  }

  try {
    const docRef = doc(db, 'Rating', title.value)
    const subCollectionRef = collection(docRef, title.value)
    console.log('Subcollection reference:', subCollectionRef)

    const subCollectionSnapshot = await getDocs(subCollectionRef)
    const fetchedRatings = []
    subCollectionSnapshot.forEach((doc) => {
      fetchedRatings.push(doc.data())
    })
    ratings.value = fetchedRatings
    console.log('Fetched ratings:', ratings.value)
  } catch (error) {
    console.error('Error fetching ratings:', error)
  }
}

const submitRating = async () => {
  try {
    const docRef = doc(db, 'Rating', title.value)

    const subCollectionRef = collection(docRef, title.value)
    console.log('Subcollection reference:', subCollectionRef)
    const newDocRef = doc(subCollectionRef)
    await setDoc(docRef, {
      title: title.value
    })
    await setDoc(newDocRef, {
      link: relatedLink.value,
      rating: rating.value,
      username: userName.value,
      comment: document.getElementById('comment').value,
      date: new Date().toISOString()
    })

    console.log('Rating submitted successfully')
    document.getElementById('comment').value = ''
    resetRatingValue.value = 0

    await fetchRatings(title.value)
  } catch (error) {
    console.error('Error submitting rating:', error)
  }
}

const onRatingSelected = (value) => {
  rating.value = value
}

onMounted(async () => {
  relatedLink.value = await fetchGoogleSearchLink(title.value + ' mental health')
  userName.value = await getCurrentUserName()
  await fetchRatings()
  loading.value = false
})
</script>

<style scoped>
.body {
  height: 100vh;
  background-color: antiquewhite;
  overflow: hidden;
}

.sub-title {
  font-size: 1.2rem;
  color: #5e91ce;
}
.menu-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.link-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-style: italic;
  font-size: 1.5rem;
}

.return-a {
  color: #5e91ce;
  text-decoration: none;
  cursor: pointer;
}

.vertical-line {
  width: 1px;
  height: 100%;
  background-color: #5e91ce;
  margin: 0 auto;
}

.resource-details {
  padding: 20px;
  overflow-y: scroll;
  height: 80vh;
}

.btn-refresh {
  background: linear-gradient(to top, #104a4e, #2a9ca7, #92dae8);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgb(61, 61, 61, 0.1);
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #5e91ce;
  margin-top: 20px;
}

@media (max-width: 1199.8px) {
  .vertical-line {
    display: none;
  }

  .body {
    height: 100vh;
    background-color: antiquewhite;
  }

  .link-container {
    font-size: 1.2rem;
  }

  .menu-container {
    display: flex;
    height: auto;
    justify-content: space-between;
  }

  .send-rating {
    flex-direction: column;
    align-items: center;
  }

  .btn-refresh {
    background: linear-gradient(to top, #104a4e, #2a9ca7, #92dae8);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 0.7rem;
    cursor: pointer;
    box-shadow: 0 4px 8px rgb(61, 61, 61, 0.1);
  }
}
</style>
