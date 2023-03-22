sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },

        formatPartnerType: function (sPartnerType) { 
            switch (sPartnerType) { 
                case "1": 
                    return this.getText("txtOrganization"); 
                case "2": 
                    return this.getText("txtPerson"); 
                default: 
                    return ""; 
            } 
        }

    };

});