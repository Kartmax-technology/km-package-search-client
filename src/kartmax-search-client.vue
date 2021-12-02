<script>
import axios from 'axios';

export default {
  methods: {
    async init(arg) {
      let form = {};
      form.collection = "K50qtol4isMqmdFjz6xnWCFz5oAc3s";
      form.query = arg;
      form.page = 1;
      form.count = 12;
      form.filter = "brand~clarks";
      form.sort_by = "discounted_price";
      form.sort_dir = "asc";

      var authOptions = {
        method: "GET",
        url: `https://ai.kartmax.in/api/r9phKuPML3NTZSCiiINdELAkP8hzxjZkqUPiI6FG/search-get/v1/plp-special`,
        headers: {
          "Content-Type": "application/json",
        },
        params: form,
      };

      //Preparing requests & calculating response time
      var start = Date.now();
      let tempresponse = await axios(authOptions);
      var totalTimeTaken = Date.now() - start;
      let response = await tempresponse.data;

      //catching response and working on it
      if (response) {
        // sending data to the kartmax search analytics
        response.responseTime = totalTimeTaken
        let searchAnalytics = {
          queryData: response.query,
          responseData: {
            responseTime: response.responseTime,
            totalHits: response.totalHits,
            uniqueId: response.uniqueId,
          },
          collection: 'K50qtol4isMqmdFjz6xnWCFz5oAc3s',
        };

        if (response.response.success === 1) {
          axios
              .post(
                  `https://search.kartmax.in/api/r9phKuPML3NTZSCiiINdELAkP8hzxjZkqUPiI6FG/search/v1/analytics-record-plp`,
                  searchAnalytics
              )
              .then((res) => {
                console.log("Kartmax Search Analytics was saved");
              })
              .catch((err) => {
                console.log("error=== kartmax search analytics", err);
              });
        }
      }
      return response;
    }
  },
};
</script>

