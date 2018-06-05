<template>
  <div>
  <h2>Hello from {{text}}</h2>
  <button>Open Windows</button>
  </div>
</template>

<script>
export default {
  name: 'main',
  data () {
    return {
       text: ''
    }
  }
}
</script>
