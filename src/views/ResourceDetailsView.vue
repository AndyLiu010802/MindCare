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
        <p>{{ explaination[title] }}</p>
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
            <div id="averageRating"></div>
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
              <div id="rating" class="star-rating d-flex justify-content-end p-2">
                <span v-for="star in 5" :key="star" class="star">
                  <span
                    v-if="star <= rating.rating"
                    :style="{
                      color: star <= rating.rating ? 'rgb(28, 152, 235)' : 'lightgray',
                      fontSize: '1.5rem'
                    }"
                    >&#9733;</span
                  >

                  <span
                    v-else
                    :style="{
                      fontSize: '1.5rem'
                    }"
                    >&#9734;</span
                  >
                </span>
              </div>
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
              <div class="text-secondary">{{ rating.link }}</div>
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

const explaination = {
  Addiction:
    'Addiction is a complex condition, a brain disease that is manifested by compulsive substance use despite harmful consequence. People with addiction have an intense focus on using a certain substance(s), such as alcohol or drugs, to the point that it takes over their life. Addiction is a chronic disease characterized by drug seeking and use that is compulsive, or difficult to control, despite harmful consequences.',
  Anxiety:
    'Anxiety is a normal and often healthy emotion. However, when a person regularly feels disproportionate levels of anxiety, it might become a medical disorder. Anxiety disorders form a category of mental health diagnoses that lead to excessive nervousness, fear, apprehension, and worry. These disorders alter how a person processes emotions and behave, also causing physical symptoms. Mild anxiety might be vague and unsettling, while severe anxiety may seriously affect day-to-day living.',
  ADHD: "Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental disorder affecting both children and adults around the world. It is characterized by symptoms of inattention, hyperactivity, and impulsivity that can impact an individual's ability to focus, learn, and interact with others. ADHD is a common condition that can affect people of all ages, but it is most often diagnosed in childhood. Symptoms of ADHD can be managed with a combination of medication, therapy, and lifestyle changes.",
  "Asperger's":
    "Asperger's syndrome is a developmental disorder that affects a person's ability to socialize and communicate effectively with others. Children with Asperger's syndrome typically exhibit social awkwardness and an all-absorbing interest in specific topics. They often have difficulty understanding the subtleties of language and nonverbal cues such as facial expressions or tone of voice. Many children with Asperger's syndrome are exceptionally talented or skilled in a particular area, such as music or math.",
  Autism:
    'Autism, or autism spectrum disorder (ASD), refers to a broad range of conditions characterized by challenges with social skills, repetitive behaviors, speech, and nonverbal communication. According to the Centers for Disease Control, autism affects an estimated 1 in 54 children in the United States today. We know that there is not one autism but many subtypes, most influenced by a combination of genetic and environmental factors. Because autism is a spectrum disorder, each person with autism has a distinct set of strengths and challenges. The ways in which people with autism learn, think and problem-solve can range from highly skilled to severely challenged. Some people with ASD may require significant support in their daily lives, while others may need less support and, in some cases, live entirely independently.',
  'Bipolar Disorder':
    'Bipolar disorder is a mental health condition that causes extreme mood swings that include emotional highs (mania or hypomania) and lows (depression). When you become depressed, you may feel sad or hopeless and lose interest or pleasure in most activities. When your mood shifts to mania or hypomania (less extreme than mania), you may feel euphoric, full of energy, or unusually irritable. These mood swings can affect sleep, energy, activity, judgment, behavior, and the ability to think clearly. Episodes of mood swings may occur rarely or multiple times a year. While most people will experience some emotional symptoms between episodes, some may not experience any.',
  Depression:
    'Depression is a common and serious medical illness that negatively affects how you feel, the way you think and how you act. Fortunately, it is also treatable. Depression causes feelings of sadness and/or a loss of interest in activities you once enjoyed. It can lead to a variety of emotional and physical problems and can decrease your ability to function at work and at home.',
  Schizophrenia:
    'Schizophrenia is a chronic and severe mental disorder that affects how a person thinks, feels, and behaves. People with schizophrenia may seem like they have lost touch with reality, which can be distressing for both them and their loved ones. While schizophrenia is a chronic disorder, many fears about the disorder are not based on reality. Most people with schizophrenia get better over time, not worse. Treatment options are improving all the time and there are plenty of things you can do to manage the disorder. Schizophrenia is a serious mental disorder in which people interpret reality abnormally. Schizophrenia may result in some combination of hallucinations, delusions, and extremely disordered thinking and behavior that impairs daily functioning, and can be disabling.',
  'Obsessive-Compulsive Disorder (OCD)':
    'Obsessive-compulsive disorder (OCD) is a mental disorder characterized by intrusive thoughts that produce anxiety (obsessions) and repetitive behaviors aimed at reducing the anxiety (compulsions). While it is normal for individuals to experience some degree of anxiety and engage in repetitive behaviors, individuals with OCD experience these symptoms with such intensity and frequency that it interferes with their daily life. OCD is a chronic condition that can be managed with treatment.',
  'Post-Traumatic Stress Disorder (PTSD)':
    'Post-traumatic stress disorder (PTSD) is a mental health condition that is triggered by a terrifying event — either experiencing it or witnessing it. Symptoms may include flashbacks, nightmares, and severe anxiety, as well as uncontrollable thoughts about the event. Most people who go through traumatic events may have temporary difficulty adjusting and coping, but with time and good self-care, they usually get better. If the symptoms get worse, last for months or even years, and interfere with your day-to-day functioning, you may have PTSD.',
  'Panic Disorder':
    'Panic disorder is a type of anxiety disorder. It causes panic attacks, which are sudden feelings of terror when there is no real danger. You may feel as if you are losing control. You may also have physical symptoms, such as fast heartbeat, chest pain, sweating, and shaking.',
  'Eating Disorders':
    'Eating disorders are serious mental health conditions that can affect anyone',
  'Borderline Personality Disorder':
    'Borderline personality disorder (BPD) is a serious mental illness that centers on the inability to manage emotions effectively. The disorder occurs in the context of relationships: sometimes all relationships are affected, sometimes only one. It usually begins during adolescence or early adulthood. While some persons with BPD are high functioning in certain settings, their private lives may be in turmoil. Most people who have BPD suffer from problems regulating their emotions and thoughts, impulsive and sometimes reckless behavior, and unstable relationships.',
  'Schizoaffective Disorder':
    "Schizoaffective disorder is a chronic mental health condition characterized primarily by symptoms of schizophrenia, such as hallucinations or delusions, and symptoms of a mood disorder, such as mania and depression. Reading NAMI's content on schizophrenia and bipolar disorder will offer many overlapping resources for schizoaffective disorder. Like schizophrenia, schizoaffective disorder is a psychotic disorder. People with schizoaffective disorder can experience both extremes — mania and depression — sometimes simultaneously. The disorder can make it difficult to perform daily activities, such as work, relationships, and self-care.",
  'Generalized Anxiety Disorder':
    'Generalized anxiety disorder (GAD) is characterized by persistent and excessive worry about a number of different things. People with GAD may anticipate disaster and may be overly concerned about money, health, family, work, or other issues. Individuals with GAD find it difficult to control their worry. They may worry more than seems warranted about actual events or may expect the worst even when there is no apparent reason for concern.',
  'Social Anxiety Disorder':
    "Social anxiety disorder (SAD) is a common but underdiagnosed mental health condition experienced across different age groups. It is characterized by an intense fear of social situations, leading to avoidance of social interactions. People with social anxiety disorder may worry about acting in a way that may cause embarrassment or humiliation. They may also fear judgment or scrutiny by others. Social anxiety disorder can significantly impact an individual's quality of life, affecting their ability to form relationships, attend social events, or perform well at work or school.",
  'Dissociative Identity Disorder':
    "Dissociative identity disorder (DID) is a rare condition in which two or more distinct identities, or personality states, are present in—and alternately take control of—an individual. Some people describe this as an experience of possession. The person also experiences memory loss that is too extensive to be explained by ordinary forgetfulness. DID is a severe form of dissociation, a mental process that produces a lack of connection in a person's thoughts, memories, feelings, actions, or sense of identity."
}
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
  fetchAverageRating(relatedLink.value)
}

const fetchAverageRating = async (link) => {
  await fetchRatings()

  const matchedRatings = ratings.value.filter((rating) => rating.link === link)
  console.log('Matched ratings:', matchedRatings)
  if (matchedRatings.length > 0) {
    const totalScore = matchedRatings.reduce((sum, rating) => sum + rating.rating, 0)
    const averageRating = totalScore / matchedRatings.length

    console.log('Average rating for', relatedLink, ':', averageRating)

    document.getElementById('averageRating').textContent =
      `Average Rating: ${averageRating.toFixed(2)}`
  } else {
    console.log('No matching ratings found for', relatedLink)

    document.getElementById('averageRating').textContent = 'No ratings found for this link'
  }
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
    await fetchAverageRating(relatedLink.value)
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

  fetchAverageRating(relatedLink.value)
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
  height: 100vh;
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
