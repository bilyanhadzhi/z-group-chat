document.addEventListener('DOMContentLoaded', function () {
    var charts = {
        leaderboard: {
            initChart: function (data) {
                var context = document.getElementById('leaderboard-chart');
                this.chart = new Chart(context, {
                    type: 'horizontalBar',
                    data: {
                        labels: [],
                        datasets: [{
                                label: '# of messages',
                                data: [],
                                backgroundColor: 'rgba(2, 119, 189, 0.5)'
                            }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                    barPercentage: 0.5
                                }],
                            yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                var self = this;
                var list = [];
                for (var i = 0; i < data.leaderboard.labels.length; ++i) {
                    list[i] = {};
                    list[i].name = data.leaderboard.labels[i];
                }
                for (var i = 0; i < data.leaderboard.values.length; ++i) {
                    list[i].numOfMessages = data.leaderboard.values[i];
                }
                list.sort(function (a, b) {
                    return (a.numOfMessages < b.numOfMessages ? 1 : (a.numOfMessages === b.numOfMessages ? 0 : -1));
                });
                list.forEach(function (member) {
                    self.chart.data.datasets[0].data.push(member.numOfMessages);
                    self.chart.data.labels.push(member.name);
                });
                this.chart.update();
            }
        },
        subjects: {
            initChart: function (data, wordFrqList) {
                var context = document.getElementById('subjects-chart');
                var self = this;
                this.chart = new Chart(context, {
                    type: 'horizontalBar',
                    data: {
                        labels: [],
                        datasets: [{
                                label: '# of occurrences',
                                data: [],
                                backgroundColor: 'rgba(2, 119, 189, 0.5)'
                            }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                    barPercentage: 0.5
                                }],
                            yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                var subjects = {
                    'БЕЛ': {
                        count: 0,
                        regex: /^бел$|^bel$|български|bulgarski|литература|literatura|^лит$|^lit$/i
                    },
                    'Математика': {
                        count: 0,
                        regex: /^mat$|^мат$|математика|matematika/i
                    },
                    'Английски': {
                        count: 0,
                        regex: /английски|angliiski/i
                    },
                    'Немски': {
                        count: 0,
                        regex: /немски|nemski/i
                    },
                    'История': {
                        count: 0,
                        regex: /история|istoria|istoriya|istoriq/i
                    },
                    'География': {
                        count: 0,
                        regex: /^гео$|^geo$|география|geografiq|geografia|geografiya/i
                    },
                    'Физика': {
                        count: 0,
                        regex: /физика|fizika/i
                    },
                    'Химия': {
                        count: 0,
                        regex: /химия|himiq|himia|himiya/i
                    },
                    'Биология': {
                        count: 0,
                        regex: /^био$|^bio$|биология|biologia|biologiq|biologiya/i
                    },
                    'Психология': {
                        count: 0,
                        regex: /психология|psihologia|psihologiq|psihologiya/i
                    },
                    'Логика': {
                        count: 0,
                        regex: /логика|logika/i
                    },
                    'Етика': {
                        count: 0,
                        regex: /етика|etika/i
                    },
                    'Право': {
                        count: 0,
                        regex: /право|pravo/i
                    },
                    'Философия': {
                        count: 0,
                        regex: /философия|filosofia|filosofiq|filosofiya/i
                    },
                    'Информатика': {
                        count: 0,
                        regex: /информатика|informatika/i
                    },
                    'Информационни': {
                        count: 0,
                        regex: /информационни|informacionni|^ит$|^it$/i
                    },
                    'Музика': {
                        count: 0,
                        regex: /музика|muzika/i
                    },
                    'Изобразително': {
                        count: 0,
                        regex: /изобразително|izobrazitelno|^ии$/i
                    },
                    'Физическо': {
                        count: 0,
                        regex: /физическо|fizichesko|fizi4esko|^фвс$|^fvs$/i
                    }
                };
                Object.keys(subjects)
                    .forEach(function (key) {
                    wordFrqList
                        .filter(function (word) { return word.word.match(subjects[key].regex); })
                        .forEach(function (word) { return subjects[key].count += word.count; });
                });
                var subjectsDisplayData = [];
                Object.keys(subjects)
                    .forEach(function (key) {
                    subjectsDisplayData.push({ name: key, count: subjects[key].count });
                });
                subjectsDisplayData.sort(function (a, b) {
                    return (a.count < b.count ? 1 : (a.count === b.count ? 0 : -1));
                });
                console.log(subjectsDisplayData);
                subjectsDisplayData.forEach(function (subject) {
                    self.chart.data.datasets[0].data.push(subject.count);
                    self.chart.data.labels.push(subject.name);
                });
                this.chart.update();
            }
        },
        init: function () {
            var _this = this;
            fetch("/api/stats", { credentials: 'include' })["catch"](function (err) { return console.error(err); })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                var wordFrqList = [];
                for (var i = 0; i < data.wordFrequency.labels.length; ++i) {
                    wordFrqList[i] = {};
                    wordFrqList[i].word = data.wordFrequency.labels[i];
                }
                for (var i = 0; i < data.wordFrequency.values.length; ++i) {
                    wordFrqList[i].count = data.wordFrequency.values[i];
                }
                wordFrqList.sort(function (a, b) {
                    return (a.count < b.count ? 1 : (a.count === b.count ? 0 : -1));
                });
                _this.leaderboard.initChart(data);
                _this.subjects.initChart(data, wordFrqList);
            });
        }
    };
    charts.init();
});
