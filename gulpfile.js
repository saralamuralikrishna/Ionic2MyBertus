var gulp  = require('gulp');

gulp.task("assets", function() {
    return gulp.src(["src/assets/img/*"])
        .pipe(gulp.dest("www/build/images"));
});

gulp.task("build", ["clean"], function(done) {
    runSequence(
        ["sass", "html", "fonts", "assets", "scripts"],
        function() {
            buildBrowserify().on("end", done);
        }
    );
});