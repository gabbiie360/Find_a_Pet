<template>
  <div class="contact-form">
    <h2>Contact Us</h2>
    <form>
      <label for="name">Name:</label>
      <input type="text" id="name" />

      <label for="email">Email:</label>
      <input type="email" id="email" />

      <label for="message">Message:</label>
      <textarea id="message"></textarea>

      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup>
// Aquí podés manejar lógica luego
</script>

<style scoped>
.contact-form {
  max-width: 500px;
  margin: auto;
  padding: 1rem;
}
</style>
