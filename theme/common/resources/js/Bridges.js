/**
 * Bridges Class
 */
function Bridges() {
    'use strict';        

    /**
     * @return ContactEdit
     */
    this.lookupRetrieve = function(model, qualification, parameters, attributes, successFunction, failureFunction) {
        var connector = new KD.bridges.BridgeConnector();
        // Retrieve
        connector.retrieve(model, qualification, {
            attributes: attributes,
            parameters: parameters,
            success: function(record) {
                successFunction(record);
            },
            failure: function(arg) {
                failureFunction(arg);
            }
        });
        return this;
    }

    this.lookupSearch = function(model, qualification, parameters, attributes, metadata, successFunction, failureFunction) {
        var connector = new KD.bridges.BridgeConnector();
        // Search
        connector.search(model, qualification, {
            attributes: attributes,
            parameters: parameters,
            metadata: metadata,
            success: function(list) {
                successFunction(list);
            },
            failure: function(arg) {
                failureFunction(arg);
            }
        });
        return this;
    }
}