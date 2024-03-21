<script>
    export default {
    name: 'NotFound',
    };
</script>


<template>
  <div class="flex items-center justify-center flex-col relative">
    <div class="max-w-3xl w-full px-6">
        <h1 class="text-slate-600 font-bold text-4xl pt-14 text-left">Página no encontrada</h1>
            <div class="my-10">
                <p class="mb-4">Lo sentimos, la página que buscas no existe.</p>
                <p class="mb-8">No te preocupes, aun puedes seguir disfrutantdo de nuestros servicios.</p>   
                <router-link to="/" class="text-blue-600 font-medium hover:opacity-75 underline">
                      Haz clic aqui para volver a la Home
                </router-link>
            </div>
      </div>
  </div>
</template>
  

