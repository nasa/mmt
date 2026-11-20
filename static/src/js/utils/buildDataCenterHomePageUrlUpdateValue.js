import {
  DATA_CENTER_HOME_PAGE_URL_CONTENT_TYPE,
  DATA_CENTER_HOME_PAGE_URL_TYPE
} from '@/js/constants/bulkUpdateFields'

/**
 * Builds the `updateValue` payload CMR expects for the FIND_AND_UPDATE_HOME_PAGE_URL
 * bulk-update type, which is a special case of FIND_AND_UPDATE restricted to DATA_CENTERS.
 * Per the CMR ingest docs: "when update value contains ContactInformation, it doesn't
 * replace the ContactInformation, instead it only replaces the data center HOME PAGE URL
 * part ... If the new data center HOME PAGE URL is not present in the update value, the
 * HOME PAGE URL of the found data centers will be removed."
 * @param {String} homePageUrl The new home page URL, or '' to remove the existing one.
 */
const buildDataCenterHomePageUrlUpdateValue = (homePageUrl) => ({
  ContactInformation: {
    RelatedUrls: homePageUrl
      ? [
        {
          URLContentType: DATA_CENTER_HOME_PAGE_URL_CONTENT_TYPE,
          Type: DATA_CENTER_HOME_PAGE_URL_TYPE,
          URL: homePageUrl
        }
      ]
      : []
  }
})

export default buildDataCenterHomePageUrlUpdateValue
