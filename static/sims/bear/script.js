$(function() {
    var payload;
    var defaultLayout = {
        rows: ["Covenant", "Soulbind"],
        cols: ["Legendary"],
        rowOrder: "value_z_to_a",
        colOrder: "value_z_to_a",
        rendererName: "Heatmap",
        inclusions: {},
        exclusions: {}
    }

    let rend = $.pivotUtilities.renderers;
    let plot = $.pivotUtilities.plotly_renderers;
    delete rend["Table Barchart"];
    rend["Vertical Bar"] = plot["Bar Chart"];
    rend["Horizontal Bar"] = plot["Horizontal Bar Chart"];
    rend["Line Chart"] = plot["Line Chart"];
    rend["Area Chart"] = plot["Area Chart"];

    var talentCode = {
        '15': { '1': "BRA",  '2': "BF",   '3': "FUR" },
        '40': { '1': "SOTF", '2': "GG",   '3': "INC" },
        '45': { '1': "EW",   '2': "SURV", '3': "GOE"  },
        '50': { '1': "RT",   '2': "TC",   '3': "PUL"  }
    }
    function getTalentNum(tier, tal) {
        let o = talentCode[tier];
        return Object.keys(o).find(key => o[key] === tal);
    }
    function getT15(r) { return talentCode['15'][r.tal.charAt(0)]; }
    function getT40(r) { return talentCode['40'][r.tal.charAt(4)]; }
    function getT45(r) { return talentCode['45'][r.tal.charAt(5)]; }
    function getT50(r) { return talentCode['50'][r.tal.charAt(6)]; }

    var whLinks = {
        'lycaras': "<a href=https://shadowlands.wowhead.com/spell=340059>Lycaras</a>",
        'circle': "<a href=https://shadowlands.wowhead.com/spell=338657>Circle</a>",
        'UFR': "<a href=https://shadowlands.wowhead.com/spell=339056>UfR</a>",
        'luffa': "<a href=https://shadowlands.wowhead.com/spell=339060>Luffa</a>",
        'legacy': "<a href=https://shadowlands.wowhead.com/spell=339062>Legacy</a>",
        'DoDF': "<a href=https://shadowlands.wowhead.com/spell=338658>DoDF</a>",
    }

    var legendaries = {
        'lycaras': "waist=,id=172320,gems=16vers,bonus_id=7110/6716/7194/6649/6650/",
        'circle': "finger1=,id=178926,gems=16vers,enchant=tenet_of_versatility,bonus_id=7085/6716/7193/6649/6650/",
        'UFR': "legs=,id=172318,bonus_id=6716/7094/6649/6650",
        'luffa': "chest=,id=172314,enchant=eternal_stats,bonus_id=7092/6716/6649/6650/",
        'legacy': "feet=,id=172315,enchant=eternal_agility,bonus_id=7095/6716/6649/6650/",
        'DoDF': "chest=,id=172314,enchant=eternal_stats,bonus_id=7086/6716/6649/6650/"
    }

    var soulbinds = {
        'pelagos': "combat_meditation",
        'kleia': "",
        'mikanikos': "brons_call_to_action",
        'marileth': "",
        'emeni': "lead_by_example",
        'heirmir': "forgeborne_reveries",
        'niya': "grove_invigoration",
        'dreamweaver': "field_of_blossoms",
        'korayn': "wild_hunt_tactics",
        'nadjia': "thrill_seeker",
        'theotar': "soothing_shade",
        'draven': ""
    }

    function isHeroic() {
        return $("#fightstyle").val().includes("combo_h");
    }

    function toCap(s) { return s.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))); }
    function stripHTML(s) { return s.replace(/<[^>]*>?/gm, ''); }

    function getRecord(filters, pivotData) {
        let buf = [];
        pivotData.forEachMatchingRecord(filters, (r) => { buf.push(r); });
        buf.sort(function(a, b) { return b.dps - a.dps; });
        return buf[0];
    }

    var defaultOptions = {
        renderers: rend,
        hiddenFromDragDrop: ["dps", "cov", "soul", "cond1", "cond2", "leg", "tal"],
        hiddenFromAggregators: ["cov", "soul", "cond1", "cond2", "leg", "tal"],
        aggregators: {
            "DPS": function() { return $.pivotUtilities.aggregatorTemplates.max()(["dps"]) }
        },
        vals: ["dps"],
        rendererOptions: {
            heatmap: {
                colorScaleGenerator: function(val) {
                    let min = Math.min(...val);
                    let max = Math.max(...val);
                    return Plotly.d3.scale.linear()
                        .domain([min, max])
                        .range(["#FFFFFF", "#FF7D0A"])
                }
            },
            table: {
                mouseenterCallback: function(e, value, filters, pivotData) {
                    let $tar = $(e.target);
                    if ($tar.hasClass("pvtVal")) {
                        let r = getRecord(filters, pivotData);
                        let str = "<table class=\"tip\">";
                        str += "<tr><td class=\"tip-right\">Covenant:</td><td>" + r.Covenant + "</td></tr>";
                        str += "<tr><td class=\"tip-right\">Soulbind:</td><td>" + r.Soulbind + "</td></tr>";
                        str += "<tr><td class=\"tip-right\">Talents:</td><td>" + r.Talents + "</td></tr>";
                        str += "<tr><td class=\"tip-right\">Conduit1:</td><td>" + r.Conduit1 + "</td></tr>";
                        str += "<tr><td class=\"tip-right\">Conduit2:</td><td>" + r.Conduit2 + "</td></tr>";
                        str += "<tr><td class=\"tip-right\">Legendary:</td><td>" + stripHTML(r.Legendary) + "</td></tr>";
                        str += "<tr class=\"tip-dps\"><td class=\"tip-right\">DPS:</td><td>" + r.dps.toFixed(2) + "</td></tr>";
                        str += "</table>"
                        $(".ui-tooltip-content").html(str);
                    }
                },
                clickCallback: function(e, value, filters, pivotData) {
                    let $tar = $(e.target);
                    if ($tar.hasClass("pvtVal")) {
                        const el = document.createElement('textarea');
                        let prof = isHeroic() ? "sandbear_h.txt" : "sandbear.txt";
                        $.get(prof, (d) => {
                            let r = getRecord(filters, pivotData);
                            let bonus = isHeroic() ? "1522" : "1532";
                            let buf = [];

                            buf.push(d);
                            buf.push("covenant=" + r.cov);
                            buf.push("talents=" + r.tal);
                            buf.push(legendaries[r.leg] + bonus);

                            let cond = [];
                            if (soulbinds[r.soul] !== "") { cond.push(soulbinds[r.soul]) };
                            if (r.cond1 !== "none") { cond.push(r.cond1); }
                            if (r.cond2 !== "none") { cond.push(r.cond2); }
                            buf.push("soulbind=" + cond.join("/"));

                            el.value = buf.join("\n");
                            document.body.appendChild(el);
                            el.select();
                            document.execCommand('copy');
                            document.body.removeChild(el);

                            let pos = $(e.target).offset();
                            $("#copied").css({
                                top: pos.top,
                                left: pos.left - $("#copied").width() - 18
                            }).show().delay(1000).fadeOut();
                        });
                    }
                }
            }
        },
        onRefresh: function(c) {
            if ($("#pivot").tooltip("instance")) {
                $("#pivot").tooltip("destroy");
            }
            $("#pivot").tooltip({
                items: ".pvtVal",
                position: {
                    my: "left center-60",
                    at: "right+7 center",
                    collision: "none"
                },
                show: {
                    delay: 450,
                    duration: 150
                },
                hide: false,
                content: "Something went wrong... Please submit a bug."
            });

            $("#loading").hide();

            (async () => {
                const runs = await fetch('https://api.github.com/repos/dreamgrove/dreamgrove/actions/workflows/update_json_bear.yml/runs');
                const r_json = await runs.json();
                if (r_json["workflow_runs"][0]["status"] === "in_progress") {
                    $("#update").html("<span id=\"inprogress\"><b>Currently Running Sims...</b></span>");
                    return;
                }

                let file = $("#fightstyle").val();
                const commit = await fetch('https://api.github.com/repos/dreamgrove/dreamgrove/commits?path=/static/sims/bear/' + file);
                const d_json = await commit.json();
                let date = new Date(d_json[0]['commit']['committer']['date']);
                $("#update").html(date.toLocaleString());
            })()
        },
        derivedAttributes: {
            'Covenant': r => { 
                let c = r.cov;
                if (c == "night_fae") { return "Night Fae"; }
                return toCap(c);
            },
            'Legendary': r => { return whLinks[r.leg]; },
            'Soulbind':  r => { return toCap(r.soul); },
            'Conduit1':  r => { return toCap(r.cond1.replaceAll('_', ' ')); },
            'Conduit2':  r => { return toCap(r.cond2.replaceAll('_', ' ')); },
            'Talents':   r => {
                let str = [];
                str.push(getT15(r));
                str.push(getT40(r));
                str.push(getT45(r));
                str.push(getT50(r));
                return str.join('/');
            },
            'T15': r => { return getT15(r); },
            'T40': r => { return getT40(r); },
            'T45': r => { return getT45(r); },
            'T50': r => { return getT50(r); }
        },
        sorters: {
            'T15': (a,b) => { return Number(getTalentNum('15', a)) - Number(getTalentNum('15', b)); },
            'T40': (a,b) => { return Number(getTalentNum('40', a)) - Number(getTalentNum('40', b)); },
            'T45': (a,b) => { return Number(getTalentNum('45', a)) - Number(getTalentNum('45', b)); },
            'T50': (a,b) => { return Number(getTalentNum('50', a)) - Number(getTalentNum('50', b)); }
        }
    }

    function load_json(url) {
        $.getJSON(url, function(json) {
            payload = json;

            $("#pivot").pivotUI(json, $.extend({}, defaultOptions, defaultLayout));
        });
    }
    function show_loading() {
        let pos = $(".pvtRendererArea").offset();
        $("#loading").css({
            top: pos.top,
            left: pos.left,
            width: $(".pvtRendererArea").width(),
            height: $(".pvtRendererArea").height(),
            display: "flex"
        });
    }

    load_json($("#fightstyle").val());
    show_loading();

    $("#fightstyle").change(function() {
        $("#pivot").tooltip("destroy");
        $(".pvtRendererArea").css("opacity", 0);
        show_loading();
        load_json($(this).val());
    });

    $("#save").on("click", function() {
        let config = $("#pivot").data("pivotUIOptions");
        let config_copy = {};

        config_copy["rows"] = config.rows;
        config_copy["cols"] = config.cols;
        config_copy["rowOrder"] = config.rowOrder;
        config_copy["colOrder"] = config.colOrder;
        config_copy["rendererName"] = config.rendererName
        config_copy["inclusions"] = config.inclusions;
        config_copy["exclusions"] = config.exclusions;

        Cookies.set("bearpivotLayout", JSON.stringify(config_copy));
    });
    $("#load").on("click", function() {
        let tok = Cookies.get("bearpivotLayout");
        if (tok) {
            let config = $("#pivot").data("pivotUIOptions");
            show_loading();
            $("#pivot").pivotUI(payload, $.extend(config, JSON.parse(tok)), true);
        }
    });
    $("#clear").on("click", function() {
        Cookies.remove("bearpivotLayout");
    });
    $("#reset").on("click", function() {
        let config = $("#pivot").data("pivotUIOptions");

        $("#pivot").pivotUI(payload, $.extend(config, defaultLayout), true);
    });

    $("#nav a.load").click(function(event) {
        $("#main").remove();
        $(".frames").width("100%");
        $("#side").height("96vh");
    });
});
(async () => {
    const content = await fetch('https://api.github.com/repos/dreamgrove/dreamgrove/contents/static/sims/bear/');
    const c_json = await content.json();
    let htmlString = '<ul>';
    for (let file of c_json) {
        let ext = file.name.split('.').pop();
        if (ext == 'txt' && file.name != 'faq.txt') {
            htmlString += `<li><a class="load" href="${file.name}" target="frame">${file.name}</a></li>`;
        }
    }
    htmlString += '</ul>';
    document.getElementById('dir').innerHTML = htmlString;
    $("#dir").find("a.load").click(function(event) {
        $("#main").remove();
        $(".frames").width("100%");
        $("#side").height("96vh");
    });
})()
function loadiFrame(f) {
    try {
        let ifdoc = f.contentWindow.document;
        if (ifdoc.contentType == "text/plain" || ifdoc.mimeType == "text/plain") {
            ifdoc.body.style.color = '#FF7D0A';
            // As requested by Tettles
            ifdoc.body.style.fontFamily = "Comic Sans MS, Comic Sans, cursive, sans-serif";
        }
    }
    catch(e) {
        return;
    }
}
