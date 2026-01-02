<script setup lang="ts">
// Initialize auth state on app load
const { fetchUser } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
