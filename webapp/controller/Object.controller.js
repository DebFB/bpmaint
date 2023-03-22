sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, History, formatter, MessageBox) {
    "use strict";

    return BaseController.extend("bpmaint06.controller.Object", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                    busy : true,
                    delay : 0,
                    edit: false
                });
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");
        },
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */


        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack : function() {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("worklist", {}, true);
            }
        },

        onEditPress: function () {
            this._changeEditStatus()
        },

        onCancelPress: function () {
            this._changeEditStatus();
        },

        onSavePress: function () {
            var that = this;
            //let oJson = this.getView().getBindingContext().getObject();
            let oModel = this.getOwnerComponent().getModel();

            let oJson = {
                PartnerId: this.getView().getBindingContext().getObject().PartnerId,
                PartnerType: this.byId("txtPartnerType").getValue(),
                PartnerName1: this.byId("txtPartnerName1").getValue(),
                PartnerName2: this.byId("txtPartnerName2").getValue(),
                SearchTerm1: this.byId("txtSearchTerm1").getValue(),
                SearchTerm2: this.byId("txtSearchTerm2").getValue(),
                Street: this.byId("txtStreet").getValue(),
                HouseNumber: this.byId("txtHouseNumber").getValue(),
                District: this.byId("txtDistrict").getValue(),
                City: this.byId("txtCity").getValue(),
                Region: this.byId("txtRegion").getValue(),
                ZipCode: this.byId("txtZipCode").getValue(),
                Country: this.byId("txtCountry").getValue()
            }

            oModel.update("/BusinessPartnerSet('" + oJson.PartnerId + "')", oJson, {
                success: (oData) => {
                    MessageBox.success(that.getText("msgBPUpdated"), {
                        title: that.getText("txtBPUpdated"),
                        onClose: function () {
                            that._onNavBack(undefined);
                        }
                    });
                },
                error: (e) => {
                    MessageBox.error(that.getText("msgBPUpdError"), {
                        title: that.getText("txtBPUpdError")
                    });
                }
            });

        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched : function (oEvent) {
            var sObjectId =  oEvent.getParameter("arguments").objectId;
            this._bindView("/BusinessPartnerSet" + sObjectId);
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView : function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange : function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.PartnerId,
                sObjectName = oObject.BusinessPartnerSet;

                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/shareSendEmailSubject",
                    oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
                oViewModel.setProperty("/shareSendEmailMessage",
                    oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        },

        _changeEditStatus: function () {
            let oViewModel = this.getModel("objectView");
            let bEdit = oViewModel.getProperty("/edit");

            oViewModel.setProperty("/edit", !bEdit);
        }
    });

});
