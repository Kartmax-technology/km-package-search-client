# Kartmax Search Client

A npm package for Kartmax Search integration.

## Under the hood (Features)

- Built in component
- Integrated with Debounce to prevent excessive requests
- Fully customizable input tag in component
- Integrated support for Analytics
- Emits response from component to your component for further action

# Screenshot
![Kartmax Search Client](https://i.imgur.com/BwGvIKq.gif)

![Kartmax Search](https://i.imgur.com/mdamKcX.gif)

# Installation

Run `npm i kartmax-search-client` into your app.

## Dependencies

- [vue-debounce](https://www.npmjs.com/package/vue-debounce)
- [axios](https://www.npmjs.com/package/axios)

# Usage
```
<script>
import Vue from 'vue';
import SearchClient from '@/kartmax-search-client.vue';

export default Vue.extend({
  components: {
    SearchClient
  },
  methods : {
     receiveResponse(response) {
       /*
       * You can use this response to do whatever you want.
       * Such as hide and show the search results or loader
       * */
       console.log("Search emitted response received");
        console.log(response);
        this.response = response;
    }
  },
  data() {
    return {
      response: '',
      options:{
        app_id: '<your-app-id>',
        emptyInputError: true,
      },
      form:{
        collection : "<your-collection-id>",
        page :1,
        count : 12,
      }
    }
  },
});
</script>

<template>
  <div id="app">
    <SearchClient
        :placeholder="'Feel free to search'"
        :class="'form-control form-control form-control-borderless'"
        :form="form"
        :options="options"
        v-on:receiveResponse="receiveResponse"
        v-model="response"
    ></SearchClient>
  </div>
</template>
```

# Methods

List of all the methods that you can use to send logs to our tool

| Options        | Description           | Required  |
| ------------- |:-------------:| -----:|
| app_id      | App id, that you received from Search | True |
| emptyInputError      | Returns error if input is empty (default false)     |   False |
| collection | Collection id from the collection that you created      |    True |
| page | Page count for pagination (default 1)      |    True |
| count | Total results expected in pagination      |    True |
| :form="form" | Object consisting of necessary payload     |    True |
| :options="options" | Object consisting of configurable options      |    True |
| v-on:receiveResponse="receiveResponse" | Directive to receive search response as soon as its received      |    False |
| v-model="response" | Binds the data to response, dependent on `v-on:receiveResponse`    |    False |
| :class="'form-control'" | Allows you to attach any class to input for designing      |    False |
| :id="'search-input'" | Allows you to attach any id to input for designing      |    False |
| :placeholder="'Feel free to search'" | Allows you to assign any placeholder to input     |    False |


# Author

[KartMax](https://www.kartmax.in) is developed by GreenHonchos, one of India’s largest 360-degree eCommerce Service Providers & Consultants. From startup brands who need a one-stop-shop cart to large enterprises of international repute looking for scale – GreenHonchos provides a one-stop solution by advising across services, such as Technology, Marketing, Operations & Marketplace Management.

## Contributor & Primary Developer

[Sagar Chauhan](https://github.com/sagarchauhan005)

# License
MIT
