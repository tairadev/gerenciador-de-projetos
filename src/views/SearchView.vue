<template>
  <div class="app-search">
    <input
      type="text"
      name="search"
      id="search"
      v-model="searchText"
      @keyup="handleKeyUp"
      @focus="handleFocus(true)"
      @blur="handleFocus(false)"
      placeholder="Digite o nome do projeto..."
      :class="{ active: isFocused }"
      autocomplete="off"
      ref="searchInput"
    >

    <ul class="history-list" v-if="historyItems.length > 0 && isFocused">
      <li v-for="(item, i) in historyItems" :key="i">
        <div class="text-container" @click="setItem(item)">
          {{ item }}
        </div>
        <div class="image-container" @click="removeItem(item)"></div>
      </li>
    </ul>

    <router-link to="/">
      <img src="../assets/icons/back.svg" alt="Voltar">
      Voltar
    </router-link>

    <h1>Resultado da busca</h1>
    <div class="app-projects-list">
      <ProjectCard
        v-for="(project, i) in filteredProjects"
        :key="i"
        :project="project"
        :id="project.id"
        :search-text="searchText"
      />

      <p class="error-message" v-if="filteredProjects.length === 0">
        {{ searchText.length < 3
          ? 'Digite ao menos 3 caracteres para pesquisar.'
          : 'Nenhum projeto foi encontrado!' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { debounce } from 'lodash';
import ProjectCard from '../components/ProjectCard.vue';
import { Project } from '../interfaces/project';
import { getHistory, getProjects, setHistory } from '../helpers/LocalStorageHelper';

const projects = ref<Project[]>(getProjects());
const searchText = ref('');
const filteredProjects = ref<Project[]>([]);
const isFocused = ref(false);
const historyItems = ref(getHistory().reverse());
const searchInput = ref<HTMLInputElement | null>(null);

function setItem(item: string) {
  searchText.value = item;
  searchInput.value?.blur();
  handleSearch();
}

function removeItem(item: string) {
  const newHistory = getHistory().filter((arrItem: string) => arrItem !== item);
  setHistory(newHistory);
  historyItems.value = newHistory;
  searchInput.value?.focus();
}

function handleFocus(focus: boolean) {
  setTimeout(() => isFocused.value = focus, 200);
}

function handleSearch() {
  if (searchText.value.length >= 3) {
    const search = searchText.value.toLowerCase();
    filteredProjects.value = projects.value.filter((project: Project) =>
      project.name.toLowerCase().includes(search)
    );

    const history = getHistory();
    if (!history.includes(searchText.value)) {
      if (history.length >= 5) history.shift();
      history.push(searchText.value);
      setHistory(history);
    }

    historyItems.value = history.reverse();
  } else {
    filteredProjects.value = [];
  }
}

const handleDebounceSearch = debounce(handleSearch, 500);

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch();
    const searchInput = document.querySelector('#search') as HTMLInputElement | null;
    if (searchInput) searchInput.blur();
  } else {
    handleDebounceSearch();
  }
};

function checkMessages(event: MessageEvent) {
  if (event.data.action === 'updateProjects') {
    try {
      projects.value = getProjects();
      handleSearch();
    } catch (error) {
      console.error("Erro ao processar os projetos salvos:", error);
    }
  }
}

onMounted(() => {
  window.addEventListener('message', checkMessages);
});

onUnmounted(() => {
  window.removeEventListener('message', checkMessages);
});
</script>

<style lang="scss" scoped>
.app-search {
  min-height: calc(100vh - 200px);
  a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    color: #695CCD;
  }
  h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    color: #1F1283;
    margin: 10px 0 20px;
  }
  input[type="text"] {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 80px;
    z-index: 11;
    border: 0;
    color: #1C1930;
    font-size: 18px;
    font-weight: 400;
    line-height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M8.99999 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 8.99999 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 8.99999 17Z' stroke='%23695CCD' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M18.9999 19L14.6499 14.65' stroke='%23695CCD' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 32px center;
    padding: 27px 32px 27px 74px;
    &.active {
      border: 2px solid #695CCD;
    }
    &:focus {
      outline: 0;
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
  .history-list {
    position: absolute;
    left: 0;
    top: 78px;
    list-style: none;
    padding: 0;
    width: 100%;
    z-index: 20;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 0 0 16px 16px;
    border: 2px solid #695CCD;
    overflow: hidden;
    li {
      position: relative;
      background-color: #FFF;
      border-top: 1px solid #F4F2FF;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M0.387097 0.516136H0.709677C0.923451 0.516136 1.09677 0.689459 1.09677 0.903233V3.95565C2.49019 1.58217 5.07222 -0.0091859 8.02558 3.9903e-05C12.4252 0.0138141 16.0069 3.6132 16 8.01278C15.9931 12.4252 12.414 16 8 16C5.93787 16 4.058 15.2198 2.63942 13.9385C2.47448 13.7895 2.46671 13.5333 2.62387 13.3761L2.8519 13.1481C2.99716 13.0028 3.2309 12.996 3.38358 13.1334C4.60587 14.2335 6.22371 14.9032 8 14.9032C11.7982 14.9032 14.9032 11.828 14.9032 8C14.9032 4.20181 11.828 1.09678 8 1.09678C5.32703 1.09678 3.00848 2.61539 1.86164 4.83872H5.03226C5.24603 4.83872 5.41935 5.01204 5.41935 5.22581V5.54839C5.41935 5.76217 5.24603 5.93549 5.03226 5.93549H0.387097C0.173322 5.93549 0 5.76217 0 5.54839V0.903233C0 0.689459 0.173322 0.516136 0.387097 0.516136Z' fill='%23717171'/%3E%3Cpath d='M10.7633 10.6849L10.9151 10.4762C11.0409 10.3033 11.0026 10.0612 10.8297 9.93545L8.51663 8.25323V3.48378C8.51663 3.27 8.34331 3.09668 8.12954 3.09668H7.87147C7.6577 3.09668 7.48438 3.27 7.48438 3.48378V8.77884L10.2226 10.7703C10.3955 10.896 10.6376 10.8578 10.7633 10.6849Z' fill='%23717171'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: 22px center;
      .text-container {
        padding: 17px 22px 17px 56px;
        color: #717171;
        font-size: 16px;
        font-weight: 400;
        line-height: 16px;
      }
      .image-container {
        display: block;
        width: 30px;
        height: 30px;
        position: absolute;
        right: 22px;
        top: 50%;
        transform: translateY(-50%);
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='21.1754' height='1.45195' transform='matrix(0.707105 0.707108 -0.707105 0.707108 1.02686 0)' fill='%23717171'/%3E%3Crect width='21.1754' height='1.45195' transform='matrix(0.707105 -0.707108 0.707105 0.707108 0 14.9733)' fill='%23717171'/%3E%3C/svg%3E%0A");;
        background-repeat: no-repeat;
        background-position: center;
      }
      &:hover {
        background-color: #F4F2FF;
        cursor: pointer;
      }
    }
  }
}
</style>