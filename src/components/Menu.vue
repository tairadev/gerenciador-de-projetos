<template>
  <nav class="app-menubar">
    <router-link to="/" title="Gerenciador de Projetos">
      <img src="/logo.svg" class="app-logo" alt="Gerenciador de Projetos" title="Gerenciador de Projetos" />
    </router-link>
    <router-link class="app-search-link" to="/busca" title="Pesquisar">
      <img src="../assets/icons/search.svg" class="app-search" alt="Pesquisar" title="Pesquisar" />
    </router-link>
  </nav>
</template>

<style lang="scss" scoped>
.app-menubar {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  background: #1c1930;
  width: 100%;
  height: 80px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 64px;
  box-sizing: border-box;
}

.app-logo {
  width: 193px;
}

.app-search-link {
  position: absolute;
  right: 64px;

  .app-search {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}

@media (max-width: 768px) {
  .app-menubar {
    padding: 0 24px;
  }
  .app-search-link {
    right: 24px;
  }
}
</style>
