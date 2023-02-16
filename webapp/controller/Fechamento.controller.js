sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/ButtonType",
    "sap/m/Label",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	'sap/ui/export/Spreadsheet',
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, Dialog, Button, ButtonType, Label, MessageBox, MessageToast, Spreadsheet, Fragment) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.Fechamento", {
		onInit: function () {
			
			//Recuperando registros para a tabela
			var oModelFechamento = new sap.ui.model.json.JSONModel();
			var oModelUpd = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModelFechamento, "oModelFechamento");
			this.getView().setModel(oModelFechamento, "oModelExport");
			this.getView().setModel(this.createAddModel(), "oModelAdd");
			this.getView().setModel(this.createUpdModel(), "oModelUpd");
			this.getServData();
		}, 
		
		createAddModel: function(){
			var oModelAdd = new sap.ui.model.json.JSONModel({
				empresa: "", cod_eve_negocio: "", ano: "", mes: "", data_inclusao: new Date(), hora_inclusao: "", mes_01: false, mes_02: false, 
				mes_03: false, mes_04: false, mes_05: false, mes_06: false, mes_07: false, mes_08: false, mes_09: false, mes_10: false, mes_11: false, mes_12: false,
				usuario_criacao: sap.ushell.Container ? sap.ushell.Container.getUser().getId() : "NAODEFINIDO",
				data_criacao: "", usuario_modif: "", data_modif: "", hora_modif: ""
			});
			
			return oModelAdd;
		},
		
		createUpdModel: function(){
			var oModelUpd = new sap.ui.model.json.JSONModel({
				empresa: "", cod_eve_negocio: "", ano: "", mes: "", data_inclusao: new Date(), hora_inclusao: "",mes_01: false, mes_02: false, 
				mes_03: false, mes_04: false, mes_05: false, mes_06: false, mes_07: false, mes_08: false, mes_09: false, mes_10: false, mes_11: false, mes_12: false,
				usuario_criacao: sap.ushell.Container ? sap.ushell.Container.getUser().getId() : "NAODEFINIDO",
				data_criacao: "", usuario_modif: "", data_modif: "", hora_modif: ""
			});
			
			return oModelUpd;
		},
		
		getServData: function (){
			var oModel = this.getOwnerComponent().getModel("FechamentoServ");
            var oFechModel = this.getView().getModel("oModelFechamento");
			var itemsCount = this.getView().byId('title');
            var that = this;
			
			//Leitura do Serviço
            oModel.read("/ZPSTA_CDS_FECHAMENTO", {
                success: async function (oData,) {
                    if(oData != null){
                        for (var i = 0; i < oData.results.length; i++) {
                            var oRow = oData.results[i];
                            for (var key in oRow) {
                                if (key.includes("mes_")) {
                                    oRow[key] = oRow[key] ? true : false;
                                }
                            }
                        }
                    }


                    if(oData != null){
                        var dataLength = oData.results.length;
                        oFechModel.setData(oData.results);
                        itemsCount.setText(`Items (${dataLength})`);
                    }
                },
                error: function (oError) {
                    console.log(oError);
                }
            });
		},
		
		onAdd: function(){
			var that = this;
			this.getView().setModel(this.createAddModel(), 'oModelAdd');
			
			if (!this.oDialogAdd) {
				this.oDialogAdd = Fragment.load({
					name: "portoseguro.zpstaparametros.view.dialogs.AddFechamento",
				    controller: this
				    });
				}
				this.oDialogAdd.then(function (oDialogAdd){
					that.getView().addDependent(oDialogAdd);  
				    oDialogAdd.open();
				    }.bind(this));
		},
		
		onSave: function(oEvent){
            var oModel = this.getOwnerComponent().getModel("FechamentoServ");
            var myDialog = sap.ui.getCore().byId("idAddFechamento");
            var that = this;
            var bodyContent = {
                empresa: "", cod_eve_negocio: "", ano: "", mes: "", data_inclusao: "", hora_inclusao: "", mes_01: "", mes_02: "", 
                mes_03: "", mes_04: "", mes_05: "", mes_06: "", mes_07: "", mes_08: "", mes_09: "", mes_10: "", mes_11: "", mes_12: "",
                usuario_criacao: sap.ushell.Container ? sap.ushell.Container.getUser().getId() : "NAODEFINIDO",
                data_criacao: "", usuario_modif: "", data_modif: "", hora_modif: ""};
            
            // Manipulando dados para inserir no objeto
            var date = sap.ui.getCore().byId('idDate').getDateValue();
            bodyContent.empresa = sap.ui.getCore().byId('iptEmp').getSelectedKey();
            bodyContent.cod_eve_negocio = sap.ui.getCore().byId('iptEve').getValue();
            bodyContent.ano = sap.ui.getCore().byId('iptAno').getValue();
            bodyContent.mes = sap.ui.getCore().byId('iptMes').getSelectedKey();
            
            bodyContent.mes_01 = sap.ui.getCore().byId('cb01').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_02 = sap.ui.getCore().byId('cb02').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_03 = sap.ui.getCore().byId('cb03').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_04 = sap.ui.getCore().byId('cb04').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_05 = sap.ui.getCore().byId('cb05').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_06 = sap.ui.getCore().byId('cb06').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_07 = sap.ui.getCore().byId('cb07').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_08 = sap.ui.getCore().byId('cb08').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_09 = sap.ui.getCore().byId('cb09').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_10 = sap.ui.getCore().byId('cb10').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_11 = sap.ui.getCore().byId('cb11').getSelected() === true ? 'X' : ''; 
            bodyContent.mes_12 = sap.ui.getCore().byId('cb12').getSelected() === true ? 'X' : '';

            var fTimeValue = sap.ui.getCore().byId('iptHrs').getDateValue();
            var oHours = fTimeValue.getHours();
            var oMinutes = fTimeValue.getMinutes();
            var oSeconds = fTimeValue.getSeconds();
            var oFTime = new Date(`Thu, 01 Jan 1970 ${oHours}:${oMinutes}:${oSeconds} GMT`);
            bodyContent.hora_inclusao = {ms: oFTime, __edmType: 'Edm.Time'};

            bodyContent.data_inclusao = date;
            bodyContent.data_criacao = date;
            var mDate = new Date('Jan 01, 1970 00:00:00 GMT');
            var mTime = Date.parse(mDate);
            bodyContent.data_modif = mDate;
            bodyContent.hora_modif = {ms: mTime, __edmType: 'Edm.Time'};

			this.onValidate(oEvent);
			
			if(
				sap.ui.getCore().byId('iptEve').getValueState() === 'Success' &&
				sap.ui.getCore().byId('iptAno').getValueState() === 'Success' &&
				sap.ui.getCore().byId("idDate").getValueState() === 'Success' &&
				sap.ui.getCore().byId("iptHrs").getValueState() === 'Success'){
				
                oModel.create("/ZPSTA_CDS_FECHAMENTO", bodyContent, {
                    success: async function (oData,) {
                        if(oData != null){
                            console.log(oData);
                            that.getServData();
                        }
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                });
				myDialog.close();
			
				this.busyDialog();
				this.onResetValueState();
			}else{
				//console.error('Erro ao salvar');
				//myDialog.close();
				//this.onResetValueState();
				MessageToast.show("Campo obrigatório vazio ou preenchido incorretamente", {duration: 800});
			}
			
			
		},	
		
		onDelMessage: function(){
			var idxLength = this.getView().byId('idFechamentoTable').getSelectedIndices().length;
			var infoMessage = `Nenhum registro foi selecionado!`;
			var dLabel = `Deseja confirmar a exclusão dos registros \n selecionados?`;
			var that = this;
						
			if(idxLength < 1){
				MessageToast.show(infoMessage, {duration: 800});
			}else{
				MessageBox.confirm(dLabel, {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if(sAction == MessageBox.Action.OK){
							if(idxLength != 0){
								that.onDelete();
							}
						}
					}
				});
			}
		},
		
		onDelete: function(oEvent){
			var oTable = this.getView().byId('idFechamentoTable');
			var selRowsIdx = oTable.getSelectedIndices();
			var oModel = this.getView().getModel('FechamentoServ');
			var that = this;
			var arrRowsWrp = [];
			
			for(var i = 0; i < selRowsIdx.length; i++){
                var empCode = oTable.getRows()[i].mAggregations.cells[0].mProperties.text;
                var empEveCode = oTable.getRows()[i].mAggregations.cells[1].mProperties.text;
                var nYear = oTable.getRows()[i].mAggregations.cells[2].mProperties.text;

                var sPath = `/ZPSTA_CDS_FECHAMENTO(empresa='${empCode}',cod_eve_negocio='${empEveCode}',ano='${nYear}')`;
                arrRowsWrp.push(sPath);
			}
			
            for(var i = 0; i < arrRowsWrp.length; i++){
                oModel.remove(arrRowsWrp[i], {
                    success: async function () {
                        MessageToast.show("Registro deletado com sucesso");
                        oTable.clearSelection();
                        that.getServData();
                    },
                    error: function (oError) {
                        console.log(oError);
                        MessageToast.show("Erro ao deletar registro", {duration: 800});
                    }
                });
            }

            this.busyDialog();
		},
		
		onEdit: function(oEvent){
			var selRowsIdx = this.getView().byId('idFechamentoTable').getSelectedIndices();
			
			if(selRowsIdx.length === 1){
				this.getRowValue();
			}else if(selRowsIdx.length < 1){
				MessageToast.show("Nenhum registro selecionado");
			}else if(selRowsIdx.length > 1){
				MessageToast.show("Só é permitido atualizar registro por vez");
			}
		},
		
		getRowValue: function(){
			var oTable = this.getView().byId('idFechamentoTable');
			var selRowsIdx = oTable.getSelectedIndices();
			var oModel = this.getView().getModel('oModelFechamento');
			
			var currView = this.getView();
			
			var oRow = oModel.getObject(oTable.getContextByIndex(selRowsIdx[0]).getPath());
			
			var dateString = oRow.data_inclusao;
			var year, month, day;
			
			if(typeof(dateString) === 'object'){
				year = dateString.getFullYear();
				month = dateString.getMonth();
				day = dateString.getDate();
			}
			else if(typeof(dateString) === 'string'){
				year = dateString.substring(0, 4);
				month = dateString.substring(4, 6);
				day = dateString.substring(6, 8);
			}

			var date = new Date(year, month, day);
			oRow.data_inclusao = date;

			var currModel = this.getView().getModel("oModelUpd");
			
			this.getView().setModel( new JSONModel(oRow) , "oModelUpd");
			
			
			this.onEditDialog();
		},
		
		onEditDialog: function(){
			var that = this;
			if (!this.oDialog) {
				this.oDialog = Fragment.load({
					name: "portoseguro.zpstaparametros.view.dialogs.UpdFechamento",
				    controller: this
				    });
				
			}
			this.oDialog.then(function (oDialog){
				that.getView().addDependent(oDialog);  
			    oDialog.open();
		    }.bind(this));

		},
		
		onEditSave: function(oEvent){
            var oModel = this.getOwnerComponent().getModel("FechamentoServ");
			var myDialog = sap.ui.getCore().byId("idUpdFechamento");
			var arrfechamento = this.getView().getModel('oModelUpd').getData();
			var that = this;
			var date = sap.ui.getCore().byId('idDateUpd').getDateValue();
            var oTable = this.getView().byId('idFechamentoTable');
            
            var sPath = `/ZPSTA_CDS_FECHAMENTO(empresa='${arrfechamento.empresa}',cod_eve_negocio='${arrfechamento.cod_eve_negocio}',ano='${arrfechamento.ano}')`;

			arrfechamento.data_inclusao = date;
			arrfechamento.data_modif = new Date();
			arrfechamento.usuario_modif = sap.ushell.Container ? sap.ushell.Container.getUser().getId() : "NAODEFINIDO";
            
            var oHours, oMinutes, oSeconds;
            oHours = new Date().getHours();
            oMinutes = new Date().getMinutes();
            oSeconds = new Date().getSeconds();
            var oFTime = new Date(`Thu, 01 Jan 1970 ${oHours}:${oMinutes}:${oSeconds} GMT`);
            arrfechamento.hora_modif = {ms: oFTime, __edmType: 'Edm.Time'};

            var fTimeValue = sap.ui.getCore().byId('iptHrs_upd').getDateValue();
            var nHours = fTimeValue.getHours();
            var nMinutes = fTimeValue.getMinutes();
            var nSeconds = fTimeValue.getSeconds();
            var nFTime = new Date(`Thu, 01 Jan 1970 ${nHours}:${nMinutes}:${nSeconds} GMT`);
            arrfechamento.hora_inclusao = {ms: nFTime, __edmType: 'Edm.Time'};

            arrfechamento.mes_01 = sap.ui.getCore().byId('updcb01').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_02 = sap.ui.getCore().byId('updcb02').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_03 = sap.ui.getCore().byId('updcb03').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_04 = sap.ui.getCore().byId('updcb04').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_05 = sap.ui.getCore().byId('updcb05').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_06 = sap.ui.getCore().byId('updcb06').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_07 = sap.ui.getCore().byId('updcb07').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_08 = sap.ui.getCore().byId('updcb08').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_09 = sap.ui.getCore().byId('updcb09').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_10 = sap.ui.getCore().byId('updcb10').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_11 = sap.ui.getCore().byId('updcb11').getSelected() === true ? 'X' : ''; 
            arrfechamento.mes_12 = sap.ui.getCore().byId('updcb12').getSelected() === true ? 'X' : '';

			var bodyContent = arrfechamento;
			console.log(arrfechamento);
			this.onValidate(oEvent);
			
			if(//sap.ui.getCore().byId('iptMes_upd').getValueState() === 'Success' &&
				sap.ui.getCore().byId("idDateUpd").getValueState() === 'Success' &&
				sap.ui.getCore().byId("iptHrs_upd").getValueState() === 'Success'){
					
                    oModel.update(sPath, bodyContent, {
                        success: async function (oData,) {
                            console.log(oData);
                            MessageToast.show("Registro atualizado com sucesso");
                            that.getServData();
                        },
                        error: function (oError) {
                            console.log(oError);
                            MessageToast.show('Erro ao atualizae registro', {duration: 800});
                        }
                    });
				    myDialog.close();
				    this.busyDialog();

				}else{
					console.error('Erro ao salvar');
					MessageToast.show("Campo obrigatório vazio ou preenchido incorretamente");
					myDialog.close();
					this.onResetValueState();
				}
			
			
			
		},
		
		onValidate: function(oEvent){
			var sBtnSrc = oEvent.oSource.sId;
			
			if(sBtnSrc === 'savebtn'){
				onValSave();
			}
			if(sBtnSrc === 'savebtn_upd'){
				onValUpdate();
			}
			
			
			function onValSave(){
				var setSuccess = sap.ui.core.ValueState.Success;
				var setError = sap.ui.core.ValueState.Error;
				
				//sap.ui.getCore().byId('iptEmp').getProperty("value").length === 4 ? sap.ui.getCore().byId('iptEmp').setValueState(setSuccess) : sap.ui.getCore().byId('iptEmp').setValueState(setError);
				sap.ui.getCore().byId('iptEve').getProperty("value").length === 3 ? sap.ui.getCore().byId('iptEve').setValueState(setSuccess) : sap.ui.getCore().byId('iptEve').setValueState(setError);
				sap.ui.getCore().byId('iptAno').getProperty("value").length === 4 ? sap.ui.getCore().byId('iptAno').setValueState(setSuccess) : sap.ui.getCore().byId('iptAno').setValueState(setError);
				//sap.ui.getCore().byId('iptMes').getProperty("value").length === 2 ? sap.ui.getCore().byId('iptMes').setValueState(setSuccess) : sap.ui.getCore().byId('iptMes').setValueState(setError);
				//sap.ui.getCore()
				var sDatePicker = sap.ui.getCore().byId("idDate");
				sDatePicker.getValue().length <= 10? sDatePicker.setValueState(setSuccess) : sDatePicker.setValueState(setError);
				
				var sTimePicker = sap.ui.getCore().byId("iptHrs");
				sTimePicker.getValue() === ''? sTimePicker.setValueState(setError) : sTimePicker.setValueState(setSuccess);
			}
			
			function onValUpdate(){
				var setSuccess = sap.ui.core.ValueState.Success;
				var setError = sap.ui.core.ValueState.Error;
				
				//sap.ui.getCore().byId('iptMes_upd').getProperty("value").length === 2 ? sap.ui.getCore().byId('iptMes_upd').setValueState(setSuccess) : sap.ui.getCore().byId('iptMes_upd').setValueState(setError);
				
				var sDatePicker = sap.ui.getCore().byId("idDateUpd");
				sDatePicker.getValue().length <= 10? sDatePicker.setValueState(setSuccess) : sDatePicker.setValueState(setError);
				
				var sTimePicker = sap.ui.getCore().byId("iptHrs_upd");
				sTimePicker.getValue() === ''? sTimePicker.setValueState(setError) : sTimePicker.setValueState(setSuccess);
			}
		},
		
		busyDialog: function(){
			if(!oBusyDialog){
				var oBusyDialog = new sap.m.BusyDialog({});
				oBusyDialog.open();
			}
			setTimeout(function () {
				oBusyDialog.close();
			}, 1000)
		},
		
		onResetValueState: function (oEvent){
			var cancelBtnId;
			var arrCbId;
			var currView = this.getView();
			var arrIptId;
			
			if(oEvent != undefined){
				cancelBtnId = oEvent.mParameters.id;
			}
			else if(sap.ui.getCore().byId('idAddFechamento') != undefined){
				cancelBtnId = 'addCancel';
			}
			else if(sap.ui.getCore().byId('idUpdFechamento') != undefined){
				cancelBtnId = 'updCancel';
			}
			
			switch(cancelBtnId){
				case 'updCancel':
					arrIptId = ['iptEmp_upd', 'iptEve_upd', 'iptAno_upd', 'iptMes_upd', 'idDateUpd', 'iptHrs_upd'];
					arrCbId = ['updcb01','updcb02','updcb03','updcb04','updcb05','updcb06','updcb07','updcb08','updcb09','updcb10','updcb11','updcb12'];
					currView.byId('idFechamentoTable').clearSelection();
					break;
				case 'addCancel':
					arrIptId = ['iptEmp', 'iptEve', 'iptAno', 'iptMes', 'idDate', 'iptHrs'];
					arrCbId = ['cb01','cb02','cb03','cb04','cb05','cb06','cb07','cb08','cb09','cb10','cb11','cb12'];
					//sap.ui.getCore().byId('savebtn').setProperty('visible', false);
					break;
				default:
					console.log('Id não encontrado!');
					break;
			}
			
			for(var i = 0; i < arrCbId.length; i++){
				sap.ui.getCore().byId(arrCbId[i]).setSelected(false);
			}

			
			for(var i = 0; i < arrIptId.length; i++){
				if(sap.ui.getCore().byId(arrIptId[i])){
					sap.ui.getCore().byId(arrIptId[i]).resetProperty('valueState');
				}
			}
		},
		
		onCancel: function(oEvent) {
			var cancelBtnId = oEvent.mParameters.id;
			var dialogId = '';
			
			switch(cancelBtnId){
				case 'updCancel':
					dialogId = "idUpdFechamento";
					break;
				case 'addCancel':
					dialogId = "idAddFechamento";
					break;
				default:
					console.log('Id não encontrado!');
					break;
			}
			var myDialog = sap.ui.getCore().byId(dialogId);
			myDialog.close();
			
			if(!cancelBtnId =='updCancel'){
				this.getView().setModel(this.createAddModel(), 'oModelAdd');
				this.onResetValueState(oEvent);
			}
			this.getView().byId("idFechamentoTable").clearSelection();
			this.getServData();
		},
		
		onFilterDialog: function(){
			if (!this.oDialogFil) {
				this.oDialogFil = Fragment.load({
					name: "portoseguro.zpstaparametros.view.dialogs.FilterFechamento",
				    controller: this
				    });
				}
				this.oDialogFil.then(function (oDialogFil){
				    oDialogFil.open();
				    }.bind(this));
				    
		},
		
		onFilter: function(){
			var oTable = this.byId('idFechamentoTable');
			var aFilter = [];
			var filDialog = sap.ui.getCore().byId('idFiltrosFechamento');
			var iptEmp = filDialog.getContent()[0].getValue();
			var iptEve = filDialog.getContent()[1].getValue();
			var iptAno = filDialog.getContent()[2].getValue();
			
			if(iptEmp == false && iptEve == false && iptAno == false){
				filDialog.close();
			}else{
				if(iptEmp != false){
					var empFilter = new sap.ui.model.Filter( "empresa", sap.ui.model.FilterOperator.EQ, iptEmp);
					aFilter.push(empFilter);
				}
				
				if(iptEve != false){
					var eveFilter = new sap.ui.model.Filter( "cod_eve_negocio", sap.ui.model.FilterOperator.EQ, iptEve);
					aFilter.push(eveFilter);
				}
				
				if(iptAno != false){
					var anoFilter = new sap.ui.model.Filter( "ano", sap.ui.model.FilterOperator.EQ, iptAno);
					aFilter.push(anoFilter);
				}
			}
			
			oTable.getBinding("rows").filter([aFilter]);
			
			var itemsCount = this.getView().byId('title');
			var dataLength = oTable.getBinding().aIndices.length;
				itemsCount.setText(`Items (${dataLength})`);
				
			filDialog.close();
		},
		
		onFilterCancel: function(){
			var filDialog = sap.ui.getCore().byId('idFiltrosFechamento');
			filDialog.getContent()[0].setValue('');
			filDialog.getContent()[1].setValue('');
			filDialog.getContent()[2].setValue('');
			this.byId('idFechamentoTable').getBinding("rows").filter();
			filDialog.close();
			this.getServData();
		},
		
		onImport:function(){
			var fUBtn = this.byId('fileUploader');
			
			if(fUBtn.getVisible() != true){
				this.byId('fileUploader').setVisible(true);
				this.byId('importBtn').setIcon('sap-icon://decline');
			}else{
				this.byId('fileUploader').setVisible(false);
				this.byId('importBtn').setIcon('sap-icon://upload');
			}
			
		},
		
		onUpload: function(oEvent){
			var fileUploader = this.byId('fileUploader');
			var modelData = this.getView().getModel('oModelAdd');
			var fechamentoToken = this.getView().getModel().getSecurityToken();
			var that = this;
			
			if(fileUploader.getValue() == ''){
				MessageToast.show('Nenhum arquivo encontrado', {duration: 800});	
			}else{
				onProcessData(oEvent);
			}
			
			function onProcessData(oEvent){
				//	File reader
				var oFileToRead = oEvent.getParameters().files["0"];
				var oFileSource = oEvent.oSource;
				var reader = new FileReader();
				
				// Read file into memory as UTF-8
				reader.readAsText(oFileToRead);
				
				// Handle errors load
				reader.onload = loadHandler;
				reader.onerror = errorHandler;
				
				function loadHandler(event) {
					var csv = event.target.result;
					processData(csv);
				}
				
				function errorHandler(evt) {
					if(evt.target.error.name == "NotReadableError") {
						alert("Cannot read file !");
					}
				}
				
				//	Recupera valores IDSEC do arquivo CSV
				function processData(csv) {
					var allTextLines = csv.split(/\r\n|\n/);
					var lines = [];
					var arrBody = [];
					
					for (var i=1; i<allTextLines.length; i++) {
						var data = allTextLines[i].split(';');
						var tarr = [];
						for (var j=1; j<data.length; j++) {
							tarr.push(data[j]);
						}
						lines.push(tarr);
					}
					
					for(var i = 0; i < lines.length; i++){
						var objList = new Object();
						objList.empresa = lines[i][0];
						objList.cod_eve_negocio = lines[i][1];
						objList.ano = lines[i][2];;
						objList.mes = lines[i][3];;
						objList.data_inclusao = lines[i][4];;
						objList.hora_inclusao = lines[i][5];;
						objList.mes_01 = lines[i][6];;
						objList.mes_02 = lines[i][7];;
						objList.mes_03 = lines[i][8];;
						objList.mes_04 = lines[i][9];
						objList.mes_05 = lines[i][10];
						objList.mes_06 = lines[i][11];
						objList.mes_07 = lines[i][12];
						objList.mes_08 = lines[i][13];
						objList.mes_09 = lines[i][14];
						objList.mes_10 = lines[i][15];
						objList.mes_11 = lines[i][16];
						objList.mes_12 = lines[i][17];
						objList.usuario_criacao = lines[i][18];
						objList.data_criacao = lines[i][19];
						objList.usuario_modif = lines[i][20];
						objList.data_modif = lines[i][21];
						objList.hora_modif = lines[i][22];
							
						arrBody.push(objList);
					}
					
					//modelData.setData(lines);
					console.log(arrBody);
					
				
					
					var infoMessage = `Importação de arquivo cancelada!`;
					var dLabel = `Deseja confirmar a importação do arquivo?`;
								
					MessageBox.confirm(dLabel, {
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							if(sAction == MessageBox.Action.OK){
								// importarRegistro(arrBody);
							}else{
								MessageToast.show(infoMessage, {duration: 800});
								fileUploader.setValue(null);
							}
						}
					});
				}
				
				function importarRegistro(arrBody){
					var url = "/event_translator/fechamento_api?portalInterceptorAppId=psta_parametros2";
					var modelDataCont = modelData.getData();
					
					var bodyContent = {
							"acao": "New",
							"fechamento": []
					};
					
					for(var i =0; i < arrBody.length; i++){
						bodyContent.fechamento.push(arrBody[i])
					}
					
					console.log(bodyContent);
						
						fetch(url, {
							method: 'POST',
							headers: {
								"x-csrf-token": fechamentoToken,
								"Content-Type": "application/json"},
							body: JSON.stringify(bodyContent)
						})
						.then(response => {console.log(response)
							if(response.status !== 200){
								MessageToast.show('Erro ao salvar registro', {duration: 800});
							}
						})
					
					that.getView().setModel(that.createAddModel(), 'oModelAdd');
					MessageToast.show("Registro salvo com sucesso!", {duration: 800});
					fileUploader.setValue(null);
					that.getServData();
				}
			}
		},
		
		createColumnConfig: function() {
			var aCols = [];
			
			// aCols.push({label: 'mandt', property: 'mandt'});
			aCols.push({label: 'empresa', property: 'empresa'});
			aCols.push({label: 'cod_eve_negocio', property: 'cod_eve_negocio'});
			aCols.push({label: 'ano', property: 'ano'});
			aCols.push({label: 'mes', property: 'mes'});
			aCols.push({label: 'data_inclusao', property: 'data_inclusao'});
			aCols.push({label: 'hora_inclusao', property: 'hora_inclusao'});
			aCols.push({label: 'mes_01', property: 'mes_01'});
			aCols.push({label: 'mes_02', property: 'mes_02'});
			aCols.push({label: 'mes_03', property: 'mes_03'});
			aCols.push({label: 'mes_04', property: 'mes_04'});
			aCols.push({label: 'mes_05', property: 'mes_05'});
			aCols.push({label: 'mes_06', property: 'mes_06'});
			aCols.push({label: 'mes_07', property: 'mes_07'});
			aCols.push({label: 'mes_08', property: 'mes_08'});
			aCols.push({label: 'mes_09', property: 'mes_09'});
			aCols.push({label: 'mes_10', property: 'mes_10'});
			aCols.push({label: 'mes_11', property: 'mes_11'});
			aCols.push({label: 'mes_12', property: 'mes_12'});
			aCols.push({label: 'usuario_criacao', property: 'usuario_criacao'});
			aCols.push({label: 'data_criacao', property: 'data_criacao'});
			aCols.push({label: 'usuario_modif', property: 'usuario_modif'});
			aCols.push({label: 'data_modif', property: 'data_modif'});
			aCols.push({label: 'hora_modif', property: 'hora_modif'});

			return aCols;
		},

		
		onExport: function() {
			var aCols, oSettings, oSheet;
			var oTable = oTable = this.byId('idFechamentoTable');
			var oFechamentoModel = this.getView().getModel('oModelFechamento');
			var indices = oTable.getBinding('rows').aIndices;
			var aRows = [];
			aCols = this.createColumnConfig();
			
			for(var i = 0; i < indices.length; i++){
                var incObj = oFechamentoModel.getProperty('/')[indices[i]];
                for (var key in incObj) {
                    if (key.includes("data_")) {
                        incObj[key] = incObj[key] ? incObj[key].toLocaleString().substr(0,10) : false;
                    }

                    if (key.includes("hora_")) {

                        var oHours = ''+Math.floor(incObj[key].ms/1000/60/60);
                        oHours = oHours.length < 2? '0'+oHours : oHours;
                        var oMinutes = ''+Math.floor((incObj[key].ms/1000/60/60 - oHours)*60);
                        oMinutes = oMinutes.length < 2? '0'+oMinutes : oMinutes;
                        var oSecounds = ''+Math.floor(((incObj[key].ms/1000/60/60 - oHours)*60 - oMinutes)*60);
                        oSecounds = oSecounds.length < 2? '0'+oSecounds : oSecounds;
                        var timeString = `${oHours}:${oMinutes}:${oSecounds}`;

                        incObj[key] = timeString;
                    }
                    
                    if (key.includes("mes_")) {
                        incObj[key] = incObj[key] === true? 'X' : '';
                    }
                }

				aRows.push(incObj);
			}

			oSettings = {
				workbook: { columns: aCols, context: {sheetName: 'ZPSTA_FECHAMENTO'}},
				dataSource: aRows,
				fileName: `ZPSTA_FECHAMENTO.xlsx`
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					MessageToast.show('Sucesso ao exportar!');
				})
				.finally(oSheet.destroy);
		}
		
	});
});