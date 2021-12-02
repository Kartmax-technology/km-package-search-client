# Kartmax Search Client

A npm package for Kartmax Search integration. This package should be used to communicate with Kartmax Search from front-end with the basic setup and standards already defined in this package.

## Under the hood (Features)

- Built in component
- Integrated with Debounce to prevent excessive requests
- Fully customizable input tag in component
- Integrated support for Analytics
- Emits response from component to your component for further action

# Screenshot

### Generic Search with Validations

![Kartmax Search Client](https://i.imgur.com/YMb5RR2.gif)

### Search with inbuilt debounce

![Kartmax Search](https://i.imgur.com/mdamKcX.gif)

# Installation

Run `npm i kartmax-search-client` into your app.

## Dependencies

- [vue-debounce](https://www.npmjs.com/package/vue-debounce)
- [Vue 2](https://www.npmjs.com/package/vue)

# Usage
```
<script>
import Vue from 'vue';
import SearchClient from 'kartmax-search-client';

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

# Nuxt - SSR Usage

To make sure this runs on server side, you need to create your build with the following command:
```
nuxt build --standalone
```

You can add the command in your `scripts` section in the package.json file like this :

```
"scripts": {
    "build": "nuxt build --standalone",
  },
```

### Why is this needed?

* Nuxt doesn't build dependencies that are required on the server side. The default way to do so is to pass node_modules to the server side.
* Passing node_modules to the server side is not a good practice.
* Running the build command above will build the dependencies on the server side. This make it possible to bundle all the dependencies into the final artifact for the server side part.
* You can read more about it here:
    * https://stackoverflow.com/questions/50700680/nuxt-start-requires-node-modules-to-be-present-in-order-to-run
    * https://github.com/nuxt/nuxt.js/issues/4292

# Author

[KartMax](https://www.kartmax.in) is developed by GreenHonchos, one of India’s largest 360-degree eCommerce Service Providers & Consultants. From startup brands who need a one-stop-shop cart to large enterprises of international repute looking for scale – GreenHonchos provides a one-stop solution by advising across services, such as Technology, Marketing, Operations & Marketplace Management.

## Contributor

[Sagar Chauhan](https://github.com/sagarchauhan005)

# License
MIT
