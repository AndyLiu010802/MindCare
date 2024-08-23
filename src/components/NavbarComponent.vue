<script setup>
import logo from '@/assets/logo.png'
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand px-4" href="/">
      <img
        :src="logo"
        alt="Mind Care Logo"
        class="img-fluid"
        style="max-width: 100px; height: auto"
      />
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav d-flex justify-content-between w-100">
        <li class="nav-item w-50 d-none d-lg-block">
          <form class="form-inline my-2 my-lg-0 d-flex">
            <input
              class="form-control w-100"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success ml-2" type="submit">Search</button>
          </form>
        </li>
        <div class="navbar-nav d-flex justify-content-between px-5 w-50 w-lg-50">
          <li class="nav-item active">
            <a class="nav-link" href="/about">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/resources">Resources</a>
          </li>
          <li class="nav-item dropdown">
            <!-- Dropdown with inside navigation -->
            <a
              class="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Consultation
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="/consultation">Therapists</a>
              <a class="dropdown-item" href="/chat">Chat</a>
              <a class="dropdown-item" href="/map">Map</a>
              <a class="dropdown-item" href="/appointment">Make An Appointment</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/statistic">Data</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/profile">Profile</a>
          </li>
        </div>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #eeffef !important;
}
</style>
