angular.module('app', ['ngMockE2E'])
    .controller('FormController', function (inspectionService) {
        var self = this;

        self.IR = inspectionService.inspectionRequestModel;

        self.questions = {};
        self.answers = [];
        inspectionService.getQuestions()
            .then(function (questions) {
                self.questions = questions;
            });

        inspectionService.getAnswers()
            .then(function (answers) {
                self.answers = answers;
            });

    })
    .service('inspectionService', function ($http) {
        var self = this;

        self.inspectionRequestModel = {};

        self.getQuestions = function () {
            return $http.get('/questions/5')
                .then(function (data) {
                    return data.data;
                });
        };

        self.getAnswers = function () {
            return $http.get('/questions/5/answers')
                .then(function (data) {
                    return data.data;
                });
        };
    })
    .directive('qForm', function () {
        console.log('compiling complexForm');
        return {
            scope: {},
            restrict: 'E',
            templateUrl: 'templates/form.html',
            controller: 'FormController',
            controllerAs: 'formCtrl'
        };
    })

    // backend mocking
    .service('dataService', function () {
        var self = this;

        self.getQuestions = function () {
            return {
                q1: 'Question 1',
                q2: 'Question 2',
                q3: 'Question 3',
                q4: 'Question 4',
                q5: 'Question 5'
            };
        };

        self.getAnswers = function () {
            return [
                {id: 'a1', label: 'Answer 1'},
                {id: 'a2', label: 'Answer 2'},
                {id: 'a3', label: 'Answer 3'},
                {id: 'a4', label: 'Answer 4'},
                {id: 'a5', label: 'Answer 5'}
            ];
        };
    })
    .run(function ($httpBackend, dataService) {
        console.log('running...');

        $httpBackend.whenGET(/templates/).passThrough();

        $httpBackend.whenGET(/\/questions\/\d+$/).respond(function (method, url, data) {
            console.log('getQuestions: respond');
            return [200, dataService.getQuestions(), {}];
        });

        $httpBackend.whenGET('/questions/5/answers').respond(function (method, url, data) {
            console.log('getAnswers: respond');
            return [200, dataService.getAnswers(), {}];
        });
    });
