sap.ui.define([
    "portoseguro/zpstaparametros/controller/BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("portoseguro.zpstaparametros.controller.Home", {
            onInit: function () {
                //var oPage = this.getView().byId("HomePage");
			    //oPage.setBusy(false);	
            },

                onNavToZPSTA_CFG_EMP_EVE: function () {
                //	var oPage = this.getView().byId("HomePage");
                //	oPage.setBusy(true);
                    this.getRouter().navTo("emp_eve");
                },
                
                onNavToZPSTA_CFG_GP_RAMO_PASS: function () {
                    this.getRouter().navTo("ramo_pass");
                },
                
                onNavToZPSTA_CFG_ITC: function () {
                    this.getRouter().navTo("cfg_itc");
                },
                
                onNavToZPSTA_CFG_SCRIPTS: function () {
                    this.getRouter().navTo("cfg_scripts");
                },
                
                onNavToZPSTA_ATCFG_ENT: function () {
                    this.getRouter().navTo("cfg_ent");
                },
                
                onNavToZPSTA_ATCFG_ORIGEM: function () {
                    this.getRouter().navTo("cfg_origem");
                },
                onNavToZPSTA_CFG_DEPARA_PREMIO: function () {
                    this.getRouter().navTo("depara_premio");
                },
                onNavToZPSTA_CFG_DEPARA_SINISTRO: function () {
                    this.getRouter().navTo("depara_sinistro");
                },
                onNavToZPSTA_CFG_DEPARA_EMPRESA : function () {
                    this.getRouter().navTo("depara_empresa");
                },
                onNavToZPSTA_ATCFG_REG_SEM_MOVIMENTO : function () {
                    this.getRouter().navTo("reg_sem_movimento");
                },
                onNavToOZPSTA_CFG_MARGEM_ERRO_PREMIO : function () {
                    this.getRouter().navTo("margem_limite_premio");
                },
                onNavToOZPSTA_FECHAMENTO : function () {
                    this.getRouter().navTo("fechamento_contabil");
                }
        });
    });
