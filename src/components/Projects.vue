<template>
  <div class="app-projects">
    <div class="app-projects-header">
      <h1>Projetos <span>({{ projects.length }})</span></h1>
      <div class="app-projects-options">
        <ToggleFavorite 
          :favorite-active="filters.favorite" 
          @click="filters.favorite = !filters.favorite" 
        />
        <Dropdown 
          :selected-order="filters.order" 
          :set-order="setOrder" 
          @click="opened = !opened" 
          @focusout="opened = false" 
          :opened="opened" 
        />
        <Button 
          class="button-primary smaller" 
          link="/novo" 
          content="Novo projeto" 
          icon="add" 
        />
      </div>
    </div>
    <div class="app-projects-list">
      <ProjectCard 
        v-for="(project, i) in projects" 
        :key="project.id" 
        :project="project" 
        :id="project.id" 
      />
      <p class="error-message" v-if="projects.length === 0">
        Nenhum projeto foi encontrado!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ProjectCard from './ProjectCard.vue';
import ToggleFavorite from './ToggleFavorite.vue';
import Button from './Button.vue';
import Dropdown from './Dropdown.vue';
import { Project } from '../interfaces/project';

const props = defineProps<{ projects: Project[] }>();

const filters = ref({
  favorite: false,
  order: 'alphabetical',
});

const opened = ref(false);

function setOrder(value: string) {
  filters.value.order = value;
}

watch(filters, (newValue) => {
  window.postMessage({ action: 'updateProjects' }, '*');
  window.postMessage({ action: 'updateFilter', filter: JSON.stringify(newValue) }, '*');
}, { deep: true });
</script>

<style lang="scss" scoped>
.app-projects {
  width: 100%;
  
  .app-projects-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 20px;
    
    h1 {
      font-size: 24px;
      font-weight: 600;
      line-height: 30px;
      color: #1F1283;

      span {
        font-size: 17px;
        font-weight: 400;
        line-height: 21.25px;
        color: #695CCD;
      }
    }
    
    .app-projects-options {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 32px;
    }
  }
  
  .app-projects-list {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    margin: 20px 0;
    
    .error-message {
      margin: 30px 0 0;
    }
  }

  @media (max-width: 992px) {
    .app-projects-header .app-projects-options {
      gap: 16px;
      align-items: flex-start;
    }
  }
  

  @media (max-width: 768px) {
    .app-projects-header {
      flex-direction: column-reverse;
      align-items: flex-start;
      .app-projects-options {
        width: 100%;
        flex-direction: column-reverse;
        margin-bottom: 24px;
        gap: 16px;
      }
    }
  }
}
</style>
  