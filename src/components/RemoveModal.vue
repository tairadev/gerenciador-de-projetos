<template>
  <div class="remove-modal-overlay">
    <div class="remove-modal">
      <h3>Remover projeto</h3>
      <p>Essa ação removerá definitivamente o projeto:</p>
      <h4>{{ project.name }}</h4>
      <div class="buttons-container">
        <Button content="Cancelar" :click-function="closeModal" class="button-secondary full-width" />
        <Button content="Remover" :click-function="removeProject" class="button-primary full-width" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Project } from '../interfaces/project';
import Button from './Button.vue';
import { getProjects, setProjects } from '../helpers/LocalStorageHelper';

interface Props {
  project: Project;
  id: string;
  closeModal: () => void;
}

const props = defineProps<Props>();

const removeProject = () => {
  try {
    const savedProjectsArray = getProjects() as Project[];
    const index = savedProjectsArray.findIndex(project => project.id === props.id);
    if (index > -1) {
      savedProjectsArray.splice(index, 1);
      setProjects(savedProjectsArray);
      window.postMessage({ action: 'updateProjects' }, '*');
      props.closeModal();
    }
  } catch (error) {
    console.error("Erro ao processar os projetos salvos:", error);
  }
};
</script>

<style lang="scss" scoped>
.remove-modal-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(24, 24, 24, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 13;
  padding: 24px;

  .remove-modal {
    position: relative;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    max-width: 582px;
    width: 100%;
    padding: 48px 32px 32px;
    text-align: center;

    h3 {
      color: #1f1283;
      font-size: 22px;
      font-weight: 600;
      line-height: 32px;
    }

    p {
      color: #717171;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      margin: 24px 0 13px;
      padding-top: 34px;
      border-top: 1px solid #8c8b93;
    }

    h4 {
      color: #1c1930;
      font-size: 24px;
      font-weight: 500;
      line-height: 32px;
      margin: 0 0 32px;
    }

    .buttons-container {
      display: flex;
      justify-content: center;
      gap: 32px;
    }

    &:before {
      content: url("data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_38_4444)'%3E%3Ccircle cx='36' cy='32' r='32' fill='%23695CCD'/%3E%3Cg clip-path='url(%23clip0_38_4444)'%3E%3Cpath d='M28.6152 27.0769H30.2563H43.3845' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M32.7179 27.077V25.4359C32.7179 25.0007 32.8908 24.5833 33.1985 24.2756C33.5063 23.9678 33.9237 23.7949 34.3589 23.7949H37.641C38.0762 23.7949 38.4936 23.9678 38.8013 24.2756C39.1091 24.5833 39.282 25.0007 39.282 25.4359V27.077M41.7435 27.077V38.5642C41.7435 38.9994 41.5706 39.4168 41.2629 39.7245C40.9551 40.0323 40.5377 40.2052 40.1025 40.2052H31.8974C31.4621 40.2052 31.0447 40.0323 30.737 39.7245C30.4292 39.4168 30.2563 38.9994 30.2563 38.5642V27.077H41.7435Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_38_4444' x='0' y='0' width='72' height='72' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='4'/%3E%3CfeGaussianBlur stdDeviation='2'/%3E%3CfeComposite in2='hardAlpha' operator='out'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_38_4444'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_38_4444' result='shape'/%3E%3C/filter%3E%3CclipPath id='clip0_38_4444'%3E%3Crect width='19.6923' height='19.6923' fill='white' transform='translate(26.1538 22.1538)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
      position: absolute;
      top: -32px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
