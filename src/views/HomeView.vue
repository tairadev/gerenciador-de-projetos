<template>
  <div class="app-home">
    <NoProjects v-if="projects.length === 0 && !filter.favorite" />
    <Projects :projects="projects" v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import NoProjects from '../components/NoProjects.vue';
import Projects from '../components/Projects.vue';
import { Project } from '../interfaces/project';
import { getProjects } from '../helpers/LocalStorageHelper';

const filter = ref({ favorite: false, order: 'alphabetical' });
const projects = ref(applyFilters(getProjects()));

function checkMessages(event: MessageEvent) {
  if (event.data.action === 'updateProjects') {
    try {
      projects.value = getProjects();
    } catch (error) {
      console.error("Erro ao processar os projetos salvos:", error);
    }
  } else if (event.data.action === 'updateFilter') {
    const filterPost = JSON.parse(event.data.filter);
    filter.value = filterPost;

    try {
      projects.value = applyFilters(getProjects());
    } catch (error) {
      console.error("Erro ao processar os projetos salvos:", error);
    }
  }
}

function applyFilters(projects: Project[]) {
  let newProjects = projects;
  if (filter.value.favorite) newProjects = newProjects.filter((project: Project) => project.favorite === filter.value.favorite);

  if (filter.value.order === 'end') {
    newProjects = newProjects.sort((a, b) => {
      const parseDate = (dateString: string) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
      };

      const dateA = parseDate(a.finalDate);
      const dateB = parseDate(b.finalDate);

      return dateA.getTime() - dateB.getTime();
    });
  } else if (filter.value.order === 'recent') {
    newProjects = newProjects.sort((a, b) => {
      const dateA = new Date(a.created).getTime();
      const dateB = new Date(b.created).getTime();

      return dateB - dateA;
    });
  }
  else newProjects = newProjects.sort((a, b) => a.name.localeCompare(b.name));

  return newProjects;
}

onMounted(() => {
  window.addEventListener('message', checkMessages);
});

onUnmounted(() => {
  window.removeEventListener('message', checkMessages);
});
</script>

<style lang="scss" scoped>
.app-home {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 200px);
}
</style>