<template>
    <div>
        <UButton>Hello {{ data ?? "World !" }}</UButton>
    </div>
</template>

<script setup lang="ts">
const data = ref(null);

useSocket<string>(EventTypes.newUser, (event) =>
{
    console.log(event);
    data.value = JSON.parse(event.data);
});
</script>
