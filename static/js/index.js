(function() {
    var app = angular.module("planApp",["ngMaterial", "ngMessages", "ngSanitize"]);
    app.controller("mainCtrl", mainCtrl);
    // Sets the theme colours
    app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme("default")
            .primaryPalette("green", {
                "default": "900",
                "hue-1": "800",
                "hue-2": "600"
            })
            .accentPalette("green", {
                "default": "300"
            })
            .warnPalette("amber", {
                "default": "400"
            });
        $mdThemingProvider.alwaysWatchTheme(true);
    })

    // Main controller function, covers all page elements
    function mainCtrl($scope, $timeout, $q, $sce, $log) {
        /* * * * * * * * * * * * * *
         * DOCUMENT TYPE SELECTION *
         * * * * * * * * * * * * * */
        // Sets the potential document type values
        $scope.docuData = [{
            value: "1APP"
        }, {
            value: "PLANAPP"
        }, {
            value: "FEEINFO"
        }, {
            value: "SUMMARY"
        }, {
            value: "PORTAL"
        }];
        // Submit button for document types
        $scope.submit = function(submitType) {
            $scope.submitType = "<p>" + submitType + "</p>"
        };

        /* * * * * * * * * * * * * *
         * APPLICATION REF SEARCH  *
         * * * * * * * * * * * * * */
        var self = this;
        self.references = loadAllReferences();
        self.selectedItemChange = selectedItemChange;
        self.selectedReferenceItem = null;
        self.searchReferenceText = null;
        self.queryReferenceSearch = querySearch;
        // Asynchrnous search operation, returns search results for a query
        function querySearch(query) {
            var results = query ? self.references.filter(createFilterFor(query)) : self.references;
            var deferred = $q.defer();
            return deferred.promise;
        }

        // Returns the selected item to be displayed on the bar
        function selectedItemChange(item) {
            $scope.referenceSearch = item.display;
        }
        // Loads and converts all reference values into a value:display pair
        function loadAllReferences() {
            var allReferences = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
                Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
                Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
                Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
                North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
                South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
                Wisconsin, Wyoming';
            return allReferences.split(/, +/g).map(function(reference) {
                return {
                    value: reference.toLowerCase(),
                    display: reference
                };
            });
        }
        // Filters out reference values that don't match the query
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(reference) {
                return (reference.value.indexOf(lowercaseQuery) === 0);
            };
        }

        /* * * * * * * * * * *
         * DOCUMENT DISPLAY  *
         * * * * * * * * * * */
        // Indexes JSON array
        $scope.pdfIndex = 0;
        // JSON array of name:url pairs for PDFs
        $scope.pdfs = [
            {
                "name": "Stokesley OS Map",
                "url": "file://ccvuni01/PlanningPortal/_Archive/6595474/Attachments/Stokesley OS Map.pdf#zoom=75"
            }, {
                "name": "Application Form",
                "url": "file://ccvuni01/PlanningPortal/_Archive/6595474/Attachments/ApplicationForm.pdf#zoom=75"
            }
        ];
        // Amount of PDFs associated with an application
        $scope.pdfCount = $scope.pdfs.length;
        // Lets Angular know the PDFs are a trusted resource so they can be loaded
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }
        // Moves forward through PDFs, loops back around if upper limit reached
        $scope.forward = function() {
            $scope.pdfIndex++;
            if ($scope.pdfIndex == $scope.pdfCount) {
                $scope.pdfIndex = 0;
            }
        }
        // Moves backward through PDFs, loops back around if lower limit reached
        $scope.backward = function() {
            $scope.pdfIndex--;
            if ($scope.pdfIndex == -1) {
                $scope.pdfIndex = $scope.pdfCount - 1;
            }
        }
    }
})();
