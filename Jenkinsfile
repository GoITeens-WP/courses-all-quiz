
@Library('jenkins-common')_

node("goiteens"){
    stage('Load credentials') {
        withCredentials([
            string(credentialsId: 'telegramApiTokenJenkinsSoftryzen', variable: 'telegramNotifyChannelBotApiToken'),
            string(credentialsId: 'telegramChatIdJenkinsSoftryzen', variable: 'telegramNotifyChannelChatId'),

            //ADD FTP CREDENTIAL
            string(credentialsId: 'ftp_user_pass_host_for_quiz_courses_all_goiteens_com', variable: 'ftpUserAndPass')
        ]) {
                env.gitRepository = 'git@github.com:GoITeens-WP/quiz.git';
                env.gitBranch = 'courses-all';
                env.folderPath = './';
                //
                env.telegramNotifyChannelBotApiToken = telegramNotifyChannelBotApiToken;
                env.telegramNotifyChannelChatId = telegramNotifyChannelChatId;
                env.ftpUserAndPass = ftpUserAndPass;
        }
    }

    stage('Setup texts') {
        def buildUrl = env.RUN_DISPLAY_URL;

        // Храним шаблоны как чистые строки с Markdown (БЕЗ преждевременного кодирования)
        env.startBuildText = "➡️ *${JOB_NAME}* started.\n[Go to build](${buildUrl})";
        env.successBuildText = "✅ *${JOB_NAME}* SUCCESS.\nTime: TIME\n[Go to build](${buildUrl})";
        env.failedBuildText = "❌ *${JOB_NAME}* FAILED.\nTime: TIME\n[Go to build](${buildUrl})";
    }

    stage('Pre Build Notify') {
        // Кодируем строку непосредственно перед отправкой в Telegram
        def encodedStartText = java.net.URLEncoder.encode(env.startBuildText, "UTF-8");

        //Send message to channel
        sendTelegramChannelMessage(
            env.telegramNotifyChannelBotApiToken,
            env.telegramNotifyChannelChatId,
            encodedStartText
        );
    }

    stage('Clone Git Repo') {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
            git branch: env.gitBranch, credentialsId: 'pasha-goitacad-ssh', url: env.gitRepository
        }
    }

    stage('Build') {
        def success = 'SUCCESS'.equals(currentBuild.currentResult);

        if (success) {
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                // Инициализируем созданную Node-24 и пакеты (pnpm, bun) внутри этого блока
                nodejs('Node-24-GoTeens') {
                    sh "chmod +x ./build.sh"
                    sh "./build.sh"
                }
            }
        }
    }

    stage('Deploy') {
        def success = 'SUCCESS'.equals(currentBuild.currentResult);

        if (success) {
            catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                def remoteProjectDir = env.folderPath.replaceAll(/\/+$/, '') ?: '.';
                def ftp = parseNcftpArgs(env.ftpUserAndPass);

                if (!ftp.user || !ftp.host) {
                    error('Could not parse FTP user/host from ftpUserAndPass');
                }

                // Сначала заливаем: чужие папки (success и т.п.) не трогаем, сайт не остаётся без файлов.
                sh "ncftpput ${env.ftpUserAndPass} ${env.folderPath} ./build/*"

                // Потом только _astro и assets: лишние хеши прошлых сборок. Пароль — LFTP_PASSWORD, не argv.
                withEnv([
                    "FTP_HOST=${ftp.host}",
                    "FTP_USER=${ftp.user}",
                    "LFTP_PASSWORD=${ftp.password}",
                    "FTP_REMOTE_DIR=${remoteProjectDir}"
                ]) {
                    sh '''
                        command -v lftp >/dev/null 2>&1 || { echo 'ERROR: lftp is not installed on the Jenkins node'; exit 1; }
                        test -d ./build || { echo 'ERROR: local build dir not found'; exit 1; }

                        remote="${FTP_REMOTE_DIR#./}"
                        remote="${remote%/}"
                        case "$remote" in
                            ""|.) astro_remote="_astro"; assets_remote="assets" ;;
                            *) astro_remote="$remote/_astro"; assets_remote="$remote/assets" ;;
                        esac

                        cmds="set cmd:fail-exit yes; set cmd:move-background no; set ftp:passive-mode yes; set ftp:ssl-allow no; set net:timeout 60; open --user '${FTP_USER}' --env-password '${FTP_HOST}';"

                        if [ -d ./build/_astro ]; then
                            echo "prune ./build/_astro -> ${astro_remote}"
                            cmds="${cmds} mirror -R --delete --only-missing --no-perms --verbose=1 ./build/_astro ${astro_remote};"
                        else
                            echo "skip _astro: not in local build"
                        fi

                        if [ -d ./build/assets ]; then
                            echo "prune ./build/assets -> ${assets_remote}"
                            cmds="${cmds} mirror -R --delete --only-missing --no-perms --verbose=1 ./build/assets ${assets_remote};"
                        else
                            echo "skip assets: not in local build"
                        fi

                        lftp --norc -c "${cmds}"
                    '''
                }

                sh "rm -r *"
            }
        }
    }

    stage('Post Build Notify') {
        def success = 'SUCCESS'.equals(currentBuild.currentResult);
        def previousBuildSuccess = true;

        if (currentBuild.previousBuild != null && !'SUCCESS'.equals(currentBuild.previousBuild.currentResult)) {
            previousBuildSuccess = false;
        }

        def message = '';

        if (success) {
            message = env.successBuildText;
        } else {
            message = env.failedBuildText;
        }

        //Calculate time
        def durationSeconds = (int) (currentBuild.duration / 1000);
        def durationMinutes = (int) (durationSeconds / 60);
        durationSeconds -= durationMinutes * 60;

        // ШАГ 1: Сначала заменяем TIME на реальное время в чистой строке (пробелы пока безопасны)
        message = message.replace('TIME', "${durationMinutes} min ${durationSeconds} sec");

        // ШАГ 2: И только теперь кодируем всю готовую строку целиком в URL-формат
        def encodedMessage = java.net.URLEncoder.encode(message, "UTF-8");

        // Send message to global notify channel
        sendTelegramChannelMessage(
            env.telegramNotifyChannelBotApiToken,
            env.telegramNotifyChannelChatId,
            encodedMessage
        )
    }
}

def parseNcftpArgs(String raw) {
    def user = '';
    def pass = '';
    def host = '';
    def tokens = raw.trim().tokenize();
    def flagsWithValue = ['-P', '-f', '-d', '-j', '-o', '-Y', '-W', '-X', '-F', '-z'];
    def idx = 0;

    while (idx < tokens.size()) {
        def token = tokens[idx];

        if (token == '-u' && idx + 1 < tokens.size()) {
            user = tokens[idx + 1];
            idx += 2;
        } else if (token == '-p' && idx + 1 < tokens.size()) {
            pass = tokens[idx + 1];
            idx += 2;
        } else if (flagsWithValue.contains(token) && idx + 1 < tokens.size()) {
            idx += 2;
        } else if (token.startsWith('-')) {
            idx += 1;
        } else {
            host = token;
            idx += 1;
        }
    }

    return [user: user, password: pass, host: host];
}
