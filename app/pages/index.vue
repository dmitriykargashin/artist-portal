<script setup lang="ts">
import { 
  Rocket, 
  BarChart3, 
  Users, 
  Zap, 
  ChevronRight, 
  Music, 
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Globe,
  Play
} from 'lucide-vue-next'

definePageMeta({
  layout: 'default'
})

// Parallax scroll effect
const scrollY = ref(0)
const heroParallax = computed(() => scrollY.value * 0.3)
const imageParallax = computed(() => scrollY.value * 0.15)
const floatParallax = computed(() => Math.sin(scrollY.value * 0.002) * 20)

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => {})
})

const features = [
  {
    icon: Rocket,
    title: 'Launch Campaigns',
    description: 'Strategic campaigns that put your music in front of the right audience at the right time.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop'
  },
  {
    icon: BarChart3,
    title: 'Track Growth',
    description: 'Real-time analytics and insights to measure your success across all platforms.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop'
  },
  {
    icon: Users,
    title: 'Build Your Team',
    description: 'Connect with industry experts, producers, and collaborators to elevate your sound.',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=300&fit=crop'
  },
  {
    icon: Zap,
    title: 'Accelerate Success',
    description: 'Proven strategies and tools designed to fast-track your music career.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop'
  }
]

const stats = [
  { value: '10M+', label: 'Streams Generated' },
  { value: '500+', label: 'Artists Launched' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Support Available' }
]

const services = [
  { icon: Music, name: 'Spotify Growth', description: 'Playlist placements & algorithmic boost' },
  { icon: Globe, name: 'Social Media', description: 'Content strategy & management' },
  { icon: Target, name: 'PR & Press', description: 'Blog features & media coverage' },
  { icon: TrendingUp, name: 'Ads & Marketing', description: 'Targeted campaigns on all platforms' },
  { icon: Sparkles, name: 'Branding', description: 'Visual identity & artwork design' },
  { icon: Shield, name: 'Strategy', description: 'Personalized growth roadmaps' }
]

// Gallery images for showcase
const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop', alt: 'Music producer working in a professional studio with mixing equipment' },
  { src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', alt: 'Singer performing live on stage with dramatic lighting' },
  { src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop', alt: 'DJ performing at a concert with colorful stage lights' },
  { src: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop', alt: 'Musician playing guitar during a live performance' }
]
</script>

<template>
  <div class="min-h-screen bg-dark-950 text-white overflow-x-hidden">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Music class="h-4 w-4 text-white" />
          </div>
          <span class="font-bold text-lg">Artist Portal</span>
        </div>
        
        <div class="flex items-center gap-4">
          <NuxtLink 
            to="/auth" 
            class="px-4 py-2 text-dark-300 hover:text-white transition-colors"
          >
            Sign In
          </NuxtLink>
          <NuxtLink 
            to="/auth"
            class="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl font-medium transition-colors"
          >
            Get Started
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section with Parallax -->
    <section class="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
      <!-- Parallax Background Effects -->
      <div class="absolute inset-0 overflow-hidden">
        <div 
          class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[150px]"
          :style="{ transform: `translateY(${heroParallax}px)` }"
        />
        <div 
          class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[120px]"
          :style="{ transform: `translateY(${-heroParallax * 0.5}px)` }"
        />
        <div 
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[200px]"
          :style="{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0002})` }"
        />
      </div>

      <!-- Floating Images with Parallax -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <img 
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=200&fit=crop"
          alt=""
          class="absolute top-32 left-12 w-48 h-32 object-cover rounded-2xl shadow-2xl opacity-40 border border-dark-700/30"
          :style="{ transform: `translateY(${imageParallax + floatParallax}px) rotate(-6deg)` }"
        >
        <img 
          src="https://images.unsplash.com/photo-1501612780327-45045538702b?w=300&h=200&fit=crop"
          alt=""
          class="absolute top-48 right-16 w-56 h-36 object-cover rounded-2xl shadow-2xl opacity-40 border border-dark-700/30"
          :style="{ transform: `translateY(${imageParallax * 1.2 - floatParallax}px) rotate(4deg)` }"
        >
        <img 
          src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=200&fit=crop"
          alt=""
          class="absolute bottom-32 left-24 w-44 h-28 object-cover rounded-2xl shadow-2xl opacity-30 border border-dark-700/30"
          :style="{ transform: `translateY(${-imageParallax * 0.8}px) rotate(3deg)` }"
        >
        <img 
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
          alt=""
          class="absolute bottom-48 right-24 w-52 h-32 object-cover rounded-2xl shadow-2xl opacity-35 border border-dark-700/30"
          :style="{ transform: `translateY(${-imageParallax * 0.6 + floatParallax * 0.5}px) rotate(-5deg)` }"
        >
      </div>

      <div class="relative max-w-7xl mx-auto text-center z-10">
        <!-- Badge -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-8"
        >
          <Sparkles class="h-4 w-4" />
          <span>The #1 Platform for Independent Artists</span>
        </div>

        <!-- Headline -->
        <h1
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
          class="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Elevate Your
          <span class="text-gradient">Music Career</span>
        </h1>

        <!-- Subheadline -->
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
          class="text-xl md:text-2xl text-dark-300 max-w-3xl mx-auto mb-10"
        >
          Professional marketing, PR, and growth services designed specifically for independent artists. 
          Your all-in-one platform to manage campaigns, track progress, and scale your success.
        </p>

        <!-- CTA Buttons -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
          class="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <NuxtLink
            to="/auth"
            class="group flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 rounded-2xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-glow"
          >
            Start Free Trial
            <ChevronRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
          <NuxtLink
            to="/auth"
            class="flex items-center gap-2 px-8 py-4 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-2xl font-semibold text-lg transition-all"
          >
            <Play class="h-5 w-5" />
            View Demo
          </NuxtLink>
        </div>

        <!-- Hero Image -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 500, duration: 800 } }"
          class="mt-16 relative"
        >
          <div class="relative rounded-2xl overflow-hidden border border-dark-700/50 shadow-2xl shadow-primary-500/10">
            <img 
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=600&fit=crop"
              alt="Artist performing"
              class="w-full h-auto object-cover"
              :style="{ transform: `translateY(${imageParallax * 0.3}px) scale(${1.1 + scrollY * 0.0001})` }"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <div class="flex items-center gap-4">
                <div class="h-14 w-14 rounded-full bg-primary-500 flex items-center justify-center shadow-glow">
                  <Play class="h-6 w-6 text-white ml-1" />
                </div>
                <div class="text-left">
                  <p class="font-semibold">See the Platform in Action</p>
                  <p class="text-dark-400 text-sm">Watch how artists grow their careers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 px-6 border-y border-dark-800/50 relative">
      <div 
        class="absolute inset-0 opacity-30"
        :style="{ transform: `translateY(${scrollY * 0.05}px)` }"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-accent-500/5" />
      </div>
      <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
          class="text-center"
        >
          <p class="text-4xl md:text-5xl font-bold text-gradient mb-2">{{ stat.value }}</p>
          <p class="text-dark-400">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Features Section with Images -->
    <section class="py-24 px-6 relative overflow-hidden">
      <!-- Parallax background element -->
      <div 
        class="absolute -top-32 -right-32 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px]"
        :style="{ transform: `translateY(${(scrollY - 800) * 0.1}px)` }"
      />
      
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-16">
          <h2
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0 }"
            class="text-4xl md:text-5xl font-bold mb-4"
          >
            Everything You Need to
            <span class="text-gradient">Succeed</span>
          </h2>
          <p class="text-xl text-dark-400 max-w-2xl mx-auto">
            From strategy to execution, we provide all the tools and services to take your career to the next level.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
            class="group relative rounded-3xl bg-dark-900/50 border border-dark-800/50 hover:border-primary-500/30 transition-all overflow-hidden"
          >
            <!-- Feature Image -->
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="feature.image"
                :alt="feature.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
              <div class="absolute top-4 left-4">
                <div class="h-12 w-12 rounded-xl bg-dark-900/80 backdrop-blur-sm flex items-center justify-center border border-dark-700/50">
                  <component :is="feature.icon" class="h-6 w-6 text-primary-400" />
                </div>
              </div>
            </div>
            <!-- Feature Content -->
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
              <p class="text-dark-400">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image Gallery Section -->
    <section class="py-24 px-6 bg-dark-900/50 relative overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0 }"
            class="text-4xl md:text-5xl font-bold mb-4"
          >
            Artists We've Helped
            <span class="text-gradient">Shine</span>
          </h2>
          <p class="text-xl text-dark-400 max-w-2xl mx-auto">
            From bedroom producers to touring acts, we've helped artists at every stage.
          </p>
        </div>

        <!-- Parallax Image Grid -->
        <ul 
          class="grid grid-cols-2 md:grid-cols-4 gap-4 list-none p-0"
          role="list"
          aria-label="Gallery of artists we have worked with"
        >
          <li
            v-for="(image, index) in galleryImages"
            :key="index"
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :visible="{ opacity: 1, scale: 1, transition: { delay: index * 100 } }"
            class="relative overflow-hidden rounded-2xl aspect-[3/4] group"
            :class="index % 2 === 0 ? 'md:mt-8' : ''"
          >
            <img 
              :src="image.src"
              :alt="image.alt"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-2xl"
              :style="{ transform: `translateY(${(scrollY - 1500) * (0.02 + index * 0.01)}px)` }"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </li>
        </ul>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-24 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0 }"
            class="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Services
          </h2>
          <p class="text-xl text-dark-400 max-w-2xl mx-auto">
            Comprehensive solutions tailored to your unique needs and goals.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(service, index) in services"
            :key="service.name"
            v-motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :visible="{ opacity: 1, scale: 1, transition: { delay: index * 50 } }"
            class="group p-6 rounded-2xl bg-dark-800/50 border border-dark-700/50 hover:border-primary-500/30 transition-all cursor-pointer hover:bg-dark-800"
          >
            <div class="flex items-center gap-4">
              <div class="h-14 w-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-colors">
                <component :is="service.icon" class="h-7 w-7 text-primary-300" />
              </div>
              <div>
                <h3 class="text-lg font-semibold">{{ service.name }}</h3>
                <p class="text-dark-400 text-sm">{{ service.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section with Background Image -->
    <section class="py-24 px-6 relative overflow-hidden">
      <!-- Background Image with Parallax -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&h=1080&fit=crop"
          alt=""
          class="w-full h-full object-cover opacity-20"
          :style="{ transform: `translateY(${(scrollY - 2500) * 0.1}px) scale(1.1)` }"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/90 to-dark-950" />
      </div>

      <div class="max-w-4xl mx-auto text-center relative z-10">
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0 }"
          class="p-12 rounded-3xl bg-gradient-to-br from-primary-500/20 via-dark-900/80 to-accent-500/20 border border-dark-700/50 backdrop-blur-sm"
        >
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            Ready to Take the Next Step?
          </h2>
          <p class="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of artists who have transformed their careers with Artist Portal.
          </p>
          <NuxtLink
            to="/auth"
            class="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-900 hover:bg-dark-100 rounded-2xl font-semibold text-lg transition-all hover:scale-105"
          >
            Get Started Free
            <ChevronRight class="h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-6 border-t border-dark-800/50">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Music class="h-4 w-4 text-white" />
          </div>
          <span class="font-bold">Artist Portal</span>
        </div>
        <p class="text-dark-500 text-sm">
          © 2026 Artist Portal. A demo application.
        </p>
      </div>
    </footer>
  </div>
</template>
