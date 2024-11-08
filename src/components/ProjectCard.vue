<template>
  <div class="project-card">
    <div class="project-thumbnail" :style="{ backgroundImage: `url('${project.thumbnail || '/thumbnail.png'}')` }">
      <div class="project-actions">
        <img :src="`/star${isFavorite ? '-filled' : ''}.png`" alt="Favoritar" @click="toggleFavorite()">
        <img src="/edit.png" alt="Editar" @click="showModal = !showModal">
        <ul class="edit-modal" v-if="showModal">
          <li @click="editProject">
            <img src="../assets/icons/edit.svg" alt="Editar">
            Editar
          </li>
          <li @click="openRemoveModal">
            <img src="../assets/icons/trash.svg" alt="Remover">
            Remover
          </li>
        </ul>
      </div>
    </div>
    <div class="project-content">
      <h2>
        <span v-for="(part, index) in highlightedName" :key="index" :class="part.highlight ? 'highlight' : ''">
          {{ part.text }}
        </span>
      </h2>
      <h3>Cliente: <span>{{ project.client }}</span></h3>
      <ul>
        <li>{{ formatDate(project.initialDate) }}</li>
        <li>{{ formatDate(project.finalDate) }}</li>
      </ul>
    </div>
  </div>
  <RemoveModal :project="project" :id="id" :close-modal="closeRemoveModal" v-if="showRemoveModal" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Project } from '../interfaces/project';
import RemoveModal from './RemoveModal.vue';
import { useRouter } from 'vue-router';
import { getProjects, setProjects } from '../helpers/LocalStorageHelper';

interface Props {
  project: Project;
  id: string;
  searchText?: string;
}

const props = defineProps<Props>();
const router = useRouter();

const isFavorite = computed(() => props.project.favorite);
const showModal = ref(false);
const showRemoveModal = ref(false);

const highlightedName = computed(() => highlightText(props.project.name));

function editProject() {
  router.push(`/editar/${props.id}`);
}

function openRemoveModal() {
  showModal.value = false;
  showRemoveModal.value = true;
}

function closeRemoveModal() {
  showRemoveModal.value = false;
}

function formatDate(dateString: string) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const [day, month, year] = dateString.split('/').map(Number);
  const monthName = months[month - 1];

  return `${day} de ${monthName} de ${year}`;
}

function toggleFavorite() {
  try {
    const savedProjectsArray = getProjects();
    const index = savedProjectsArray.findIndex((item: Project) => item.id === props.id);
    if (savedProjectsArray[index]) {
      savedProjectsArray[index].favorite = !isFavorite.value;
      setProjects(savedProjectsArray);
    }
  } catch (error) {
    console.error("Erro ao processar os projetos salvos:", error);
  }

  window.postMessage({ action: 'updateProjects' }, '*');
}

function highlightText(name: string) {
  if (props.searchText) {
    const searchText = props.searchText.toLowerCase();
    const regex = new RegExp(`(${searchText})`, 'gi');
    const parts = name.split(regex).map((part) => ({
      text: part,
      highlight: regex.test(part)
    }));

    return parts;
  }

  return [{ text: name, highlight: false }];
}
</script>

<style lang="scss" scoped>
.project-card {
  border-radius: 16px;
  width: 346px;
  overflow: hidden;

  .project-thumbnail {
    position: relative;
    width: 100%;
    height: 231px;
    padding: 17px 16px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    background-size: cover;
    background-position: center;

    .project-actions {
      display: flex;
      align-items: flex-start;
      gap: 8px;

      img {
        cursor: pointer;
      }

      .edit-modal {
        position: absolute;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        list-style: none;
        padding: 0;
        right: 16px;
        bottom: -95px;

        li {
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #695ccd;
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
          border-radius: 0 0 8px 8px;
          transition: background 0.1s;

          &:hover {
            background: #f4f2ff;
          }

          &:first-child {
            border-bottom: 1px solid #f4f2ff;
            border-radius: 8px 8px 0 0;
          }
        }

        &:before {
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='9' viewBox='0 0 12 9' fill='none'%3E%3Cpath d='M5.20759 1.02937C5.6079 0.509358 6.3921 0.509358 6.79241 1.02937L11.6888 7.39001C12.195 8.04757 11.7263 9 10.8964 9H1.10358C0.273737 9 -0.195026 8.04757 0.311171 7.39001L5.20759 1.02937Z' fill='white'/%3E%3C/svg%3E");
          position: absolute;
          right: 14px;
          top: -16px;
        }
      }
    }
  }

  .project-content {
    padding: 20px;
    border: 1px solid #dcdcdc;
    border-radius: 0 0 16px 16px;
    background: #fff;

    h2 {
      font-size: 20px;
      font-weight: 700;
      color: #1f1283;
      :deep(.highlight) {
        background: #FFB23D;
      }
    }

    h3 {
      font-size: 16px;
      font-weight: 700;
      color: #717171;
      margin: 10px 0 0;

      span {
        font-weight: 400;
      }
    }

    ul {
      list-style: none;
      margin: 16px 0 0;
      padding: 16px 0 0;
      border-top: 1px solid #ececec;

      li {
        position: relative;
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 16px;
        color: #717171;

        &:first-child::before {
          content: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_38_4557' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='2' y='0' width='21' height='24'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.75 3H18.5V0.375C18.5 0.16875 18.3312 0 18.125 0H17.375C17.1687 0 17 0.16875 17 0.375V3H8V0.375C8 0.16875 7.83125 0 7.625 0H6.875C6.66875 0 6.5 0.16875 6.5 0.375V3H4.25C3.00781 3 2 4.00781 2 5.25V21.75C2 22.9922 3.00781 24 4.25 24H20.75C21.9922 24 23 22.9922 23 21.75V5.25C23 4.00781 21.9922 3 20.75 3ZM21.5005 21.75C21.5005 22.1625 21.163 22.5 20.7505 22.5H4.25049C3.83799 22.5 3.50049 22.1625 3.50049 21.75V9H21.5005V21.75ZM3.50049 7.5H21.5005V5.25C21.5005 4.8375 21.163 4.5 20.7505 4.5H4.25049C3.83799 4.5 3.50049 4.8375 3.50049 5.25V7.5ZM7.625 1.875H8.375V3H7.625V1.875ZM16.375 1.875H17.125V3H16.375V1.875Z' fill='black'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_38_4557)' fill='%231f1283'%3E%3Cpath d='M3 5H21V8H3V5ZM3 8V21H21V8H3ZM7.625 2.25V4H8.375V2.25H7.625ZM16.375 2.25V4H17.125V2.25H16.375Z'/%3E%3C/g%3E%3C/svg%3E");
          position: absolute;
          left: 0;
        }
      }
    }
  }

  @media (max-width: 576px) {
    width: 100%;
  }
}
</style>
