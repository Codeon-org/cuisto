<template>
    <div>
        <ULink to="/test">
            Test
        </ULink>
    </div>
</template>

<script setup lang="ts">
useSocket({
    newUser: (name) =>
    {
        console.log(name);
    }
});
</script>
