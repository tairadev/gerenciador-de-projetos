p<template>
  <div class="app-new-projects">
    <router-link to="/">
      <img src="../assets/icons/back.svg" alt="">
      Voltar
    </router-link>
    <h1>{{ isEditing ? 'Editar projeto' : 'Novo projeto' }}</h1>
    <div class="form-container">
      <div class="form-content">
        <div class="form-row">
          <div class="form-col" :class="{ error: hasNameError }">
            <label for="project-name">
              Nome do projeto <span>(Obrigatório)</span>
            </label>
            <input type="text" name="project-name" id="project-name" @keydown="() => changedFormData.name = true" v-model="formData.name" />
            <p class="error-message">Por favor, digite ao menos duas palavras</p>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col" :class="{ error: hasClientError }">
            <label for="project-client">
              Cliente <span>(Obrigatório)</span>
            </label>
            <input type="text" name="project-client" id="project-client" @keydown="() => changedFormData.client = true" v-model="formData.client" />
            <p class="error-message">Por favor, digite ao menos uma palavra</p>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col" :class="{ error: hasInitialDateError }">
            <label for="project-initial-date">
              Data de Início <span>(Obrigatório)</span>
            </label>
            <input type="text" name="project-initial-date" id="project-initial-date" class="initial-date" v-mask="'##/##/####'" @keydown="() => changedFormData.initialDate = true" v-model="formData.initialDate" />
            <p class="error-message">Selecione uma data válida</p>
          </div>
          <div class="form-col" :class="{ error: hasFinalDateError }">
            <label for="project-final-date">
              Data Final <span>(Obrigatório)</span>
            </label>
            <input type="text" name="project-final-date" id="project-final-date" class="final-date" v-mask="'##/##/####'" @keydown="() => changedFormData.finalDate = true" v-model="formData.finalDate" />
            <p class="error-message">Selecione uma data válida</p>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <label>
              Capa do projeto
            </label>
            <template v-if="imagePreview">
              <img class="thumbnail-preview" v-if="imagePreview" :src="imagePreview" alt="Preview" />
              <img class="thumbnail-remove" src="../assets/icons/trash-light.svg" alt="Apagar" @click="removeImage">
            </template>
            <label for="project-thumbnail" class="thumbnail" v-else>
              <div class="file-selector">
                <img src="../assets/icons/upload.svg" alt="Upload">
                <h3>Escolha uma imagem .jpg ou .png no seu dispositivo</h3>
                <Button class="button-secondary" content="Selecionar" :click-function="triggerFileInput" />
              </div>
            </label>
            <input type="file" id="project-thumbnail" @change="handleFileUpload" accept=".png, .jpg, .jpeg" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <Button class="button-primary" content="Salvar projeto" :click-function="saveProject" :disabled="disabled" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isValidDate } from '../helpers/StringHelper';
import Button from '../components/Button.vue';
import { Project } from '../interfaces/project';
import { getProjects, setProjects } from '../helpers/LocalStorageHelper';

const router = useRouter();
const route = useRoute();

const imagePreview = ref<string | null>(null);

function triggerFileInput() {
  const fileInput = document.querySelector('#project-thumbnail') as HTMLInputElement | null;
  if (fileInput) {
    fileInput.click();
  } else {
    console.error('Elemento com ID "project-thumbnail" não encontrado.');
  }
}

function handleFileUpload (event: Event) {
  changedThumbnail.value = true;
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result as string;
      formData.value.thumbnail = base64Image;
      imagePreview.value = base64Image;
    };

    reader.readAsDataURL(file);
  }
};

function removeImage() {
  changedThumbnail.value = true;
  imagePreview.value = '';
  formData.value.thumbnail = '';
  
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}

function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function saveProject() {
  try {
    let projects = [formData.value];
    const savedProjectsArray = getProjects();
    if (isEditing.value) {
      const id = route.params.id;
      const index = savedProjectsArray.findIndex((item: Project) => item.id === id);
      savedProjectsArray[index] = {
        ...formData.value,
        thumbnail: changedThumbnail.value ? formData.value.thumbnail : imagePreview.value,
      };
    } else {
      savedProjectsArray.push({
        ...formData.value,
        created: new Date(),
      });
    }
    projects = savedProjectsArray;

    setProjects(projects);
    router.push('/')
    clearFormData();
  } catch (error) {
    alert('Ocorreu um erro ao inserir a imagem. Por favor, troque para outra imagem e tente novamente.')
  }
}

function clearFormData() {
  formData.value = {
    id: '',
    name: '',
    client: '',
    initialDate: '',
    finalDate: '',
    favorite: false,
    created: new Date(),
    thumbnail: '',
  };

  changedFormData.value = {
    name: false,
    client: false,
    initialDate: false,
    finalDate: false,
  };
}

const formData = ref({
  id: generateRandomKey(),
  name: '',
  client: '',
  initialDate: '',
  finalDate: '',
  favorite: false,
  created: new Date(),
  thumbnail: '',
});

const changedFormData = ref({
  name: false,
  client: false,
  initialDate: false,
  finalDate: false,
});

const changedThumbnail = ref(false);

const disabled = computed(() => {
  return Object.values(changedFormData.value).some(value => value === false)
    || hasNameError.value
    || hasClientError.value
    || hasInitialDateError.value ||
    hasFinalDateError.value;
});

const hasNameError = computed(() => {
  const name = formData.value?.name?.trim() || '';
  const wordCount = name.split(/\s+/).filter(word => word.length > 0).length;
  return wordCount < 2 && changedFormData.value?.name;
});

const hasClientError = computed(() => {
  return formData.value.client.length < 2 && changedFormData.value.client;
});

const hasInitialDateError = computed(() => {
  return !isValidDate(formData.value.initialDate) && changedFormData.value.initialDate;
});

const hasFinalDateError = computed(() => {
  const initialDate = formData.value.initialDate;
  const finalDate = formData.value.finalDate;
  const initialDateObject = parseDate(initialDate);
  const finalDateObject = parseDate(finalDate);
  const isFinalDateValidAndAfterInitial = finalDateObject >= initialDateObject;

  return (!isValidDate(formData.value.finalDate) || !isFinalDateValidAndAfterInitial) && changedFormData.value.finalDate;
});

const isEditing = computed(() => {
  return route.params.id !== undefined;
});

function generateRandomKey() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

onMounted(() => {
  try {
    const savedProjectsArray = getProjects();
    const id = route.params.id;
    const project = savedProjectsArray.find((item: Project) => item.id === id);
    
    if (project) {
      formData.value = project;
      if (formData.value.thumbnail) imagePreview.value = formData.value.thumbnail;
      changedFormData.value = {
        name: true,
        client: true,
        initialDate: true,
        finalDate: true,
      };
    }
  } catch (error) {
    console.error("Erro ao processar os projetos salvos:", error);
  }
});

</script>

<style lang="scss" scoped>
.app-new-projects {
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
  .form-container {
    border: 1px solid #DCDCDC;
    padding: 52px;
    border-radius: 8px;
    .form-content {
      max-width: 704px;
      display: flex;
      flex-direction: column;
      gap: 32px;
      margin: 0 auto;
      .form-row {
        display: flex;
        gap: 24px;
        .form-col {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
          .thumbnail-remove {
            position: absolute;
            right: 24px;
            top: 48px;
            cursor: pointer;
          }
          .thumbnail-preview {
            width: 100%;
            aspect-ratio: 702 / 395;
            object-fit: cover;
            object-position: center;
            margin: 4px 0 0;
            border-radius: 8px;
          }
          label {
            font-size: 18px;
            font-weight: 500;
            line-height: 22px;
            color: #695CCD;
            display: flex;
            align-items: flex-end;
            gap: 8px;
            span {
              font-size: 14px;
              font-weight: 400;
              line-height: 22px;
              color: #717171;
            }
            &.thumbnail {
              display: block;
              position: relative;
              .file-selector {
                margin: 4px 0 0;
                border-radius: 4px;
                border: 1px dashed #717171;
                padding: 24px;
                text-align: center;
                display: flex;
                align-items: center;
                flex-direction: column;
                cursor: pointer;
                h3 {
                  margin: 16px 0 24px;
                  color: #717171;
                  font-size: 16px;
                  font-weight: 400;
                  line-height: 22px;
                }
              }
            }
          }
          input {
            position: relative;
            border-radius: 8px;
            border: 1px solid #717171;
            height: 40px;
            padding: 0 16px;
            &[type="file"] {
              display: none;
            }
            &:focus {
              outline: 0;
            }
            &.initial-date {
              background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_38_4557' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='2' y='0' width='21' height='24'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.75 3H18.5V0.375C18.5 0.16875 18.3312 0 18.125 0H17.375C17.1687 0 17 0.16875 17 0.375V3H8V0.375C8 0.16875 7.83125 0 7.625 0H6.875C6.66875 0 6.5 0.16875 6.5 0.375V3H4.25C3.00781 3 2 4.00781 2 5.25V21.75C2 22.9922 3.00781 24 4.25 24H20.75C21.9922 24 23 22.9922 23 21.75V5.25C23 4.00781 21.9922 3 20.75 3ZM21.5005 21.75C21.5005 22.1625 21.163 22.5 20.7505 22.5H4.25049C3.83799 22.5 3.50049 22.1625 3.50049 21.75V9H21.5005V21.75ZM3.50049 7.5H21.5005V5.25C21.5005 4.8375 21.163 4.5 20.7505 4.5H4.25049C3.83799 4.5 3.50049 4.8375 3.50049 5.25V7.5ZM7.25146 18H11.7515C12.164 18 12.5015 17.6625 12.5015 17.25V12.75C12.5015 12.3375 12.164 12 11.7515 12H7.25146C6.83896 12 6.50146 12.3375 6.50146 12.75V17.25C6.50146 17.6625 6.83896 18 7.25146 18ZM10.9985 13.5H7.99854V16.5H10.9985V13.5Z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_38_4557)'%3E%3Crect width='24' height='24' transform='translate(2)' fill='%23717171'/%3E%3C/g%3E%3C/svg%3E%0A");
              background-repeat: no-repeat;
              background-position: calc(100% - 8px) center;
            }
            &.final-date {
              background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_38_2916' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='2' y='0' width='21' height='24'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M18.5 3H20.75C21.9927 3 23 4.00734 23 5.25V21.75C23 22.9927 21.9927 24 20.75 24H4.25C3.00734 24 2 22.9927 2 21.75V5.25C2 4.00734 3.00734 3 4.25 3H6.5V0.5625C6.5 0.251859 6.75186 0 7.0625 0H7.4375C7.74814 0 8 0.251859 8 0.5625V3H17V0.5625C17 0.251859 17.2519 0 17.5625 0H17.9375C18.2481 0 18.5 0.251859 18.5 0.5625V3ZM20.7505 4.5H4.25049C3.83696 4.5 3.50049 4.83647 3.50049 5.25V7.5H21.5005V5.25C21.5005 4.83647 21.164 4.5 20.7505 4.5ZM20.7505 22.5H4.25049C3.83696 22.5 3.50049 22.1635 3.50049 21.75V9H21.5005V21.75C21.5005 22.1635 21.164 22.5 20.7505 22.5ZM11.3122 19.63L17.6305 13.3623C17.8512 13.1434 17.8527 12.7869 17.6337 12.5662L17.2372 12.1665C17.0182 11.9457 16.6618 11.9443 16.441 12.1633L10.92 17.64L8.55554 15.2688C8.33602 15.0486 7.97958 15.0481 7.75941 15.2676L7.36074 15.6651C7.14062 15.8847 7.1401 16.2411 7.35962 16.4613L10.517 19.6278C10.7362 19.8476 11.0919 19.8485 11.3122 19.63Z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_38_2916)'%3E%3Crect width='24' height='24' transform='translate(2)' fill='%23717171'/%3E%3C/g%3E%3C/svg%3E%0A");
              background-repeat: no-repeat;
              background-position: calc(100% - 8px) center;
            }
          }
          .error-message {
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            color: #C40000;
            display: none;
          }
          &.error {
            label {
              color: #9F0000;
              span {
                color: #C40000;
              }
            }
            input {
              border-color: #C40000;
              color: #C40000;
              &.initial-date {
                background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_38_4557' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='2' y='0' width='21' height='24'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.75 3H18.5V0.375C18.5 0.16875 18.3312 0 18.125 0H17.375C17.1687 0 17 0.16875 17 0.375V3H8V0.375C8 0.16875 7.83125 0 7.625 0H6.875C6.66875 0 6.5 0.16875 6.5 0.375V3H4.25C3.00781 3 2 4.00781 2 5.25V21.75C2 22.9922 3.00781 24 4.25 24H20.75C21.9922 24 23 22.9922 23 21.75V5.25C23 4.00781 21.9922 3 20.75 3ZM21.5005 21.75C21.5005 22.1625 21.163 22.5 20.7505 22.5H4.25049C3.83799 22.5 3.50049 22.1625 3.50049 21.75V9H21.5005V21.75ZM3.50049 7.5H21.5005V5.25C21.5005 4.8375 21.163 4.5 20.7505 4.5H4.25049C3.83799 4.5 3.50049 4.8375 3.50049 5.25V7.5ZM7.25146 18H11.7515C12.164 18 12.5015 17.6625 12.5015 17.25V12.75C12.5015 12.3375 12.164 12 11.7515 12H7.25146C6.83896 12 6.50146 12.3375 6.50146 12.75V17.25C6.50146 17.6625 6.83896 18 7.25146 18ZM10.9985 13.5H7.99854V16.5H10.9985V13.5Z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_38_4557)'%3E%3Crect width='24' height='24' transform='translate(2)' fill='%23C40000'/%3E%3C/g%3E%3C/svg%3E%0A");
              }
              &.final-date {
                background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_38_2916' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='2' y='0' width='21' height='24'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M18.5 3H20.75C21.9927 3 23 4.00734 23 5.25V21.75C23 22.9927 21.9927 24 20.75 24H4.25C3.00734 24 2 22.9927 2 21.75V5.25C2 4.00734 3.00734 3 4.25 3H6.5V0.5625C6.5 0.251859 6.75186 0 7.0625 0H7.4375C7.74814 0 8 0.251859 8 0.5625V3H17V0.5625C17 0.251859 17.2519 0 17.5625 0H17.9375C18.2481 0 18.5 0.251859 18.5 0.5625V3ZM20.7505 4.5H4.25049C3.83696 4.5 3.50049 4.83647 3.50049 5.25V7.5H21.5005V5.25C21.5005 4.83647 21.164 4.5 20.7505 4.5ZM20.7505 22.5H4.25049C3.83696 22.5 3.50049 22.1635 3.50049 21.75V9H21.5005V21.75C21.5005 22.1635 21.164 22.5 20.7505 22.5ZM11.3122 19.63L17.6305 13.3623C17.8512 13.1434 17.8527 12.7869 17.6337 12.5662L17.2372 12.1665C17.0182 11.9457 16.6618 11.9443 16.441 12.1633L10.92 17.64L8.55554 15.2688C8.33602 15.0486 7.97958 15.0481 7.75941 15.2676L7.36074 15.6651C7.14062 15.8847 7.1401 16.2411 7.35962 16.4613L10.517 19.6278C10.7362 19.8476 11.0919 19.8485 11.3122 19.63Z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_38_2916)'%3E%3Crect width='24' height='24' transform='translate(2)' fill='%23C40000'/%3E%3C/g%3E%3C/svg%3E%0A");
              }
            }
            .error-message {
              display: block;
            }
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    .form-container {
      padding: 24px;
      .form-content {
        .form-row {
          flex-direction: column;
        }
      }
    }
  }
}
</style>
  