
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

   stage('Build'){
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
                //sent files to url
                sh "ncftpput ${env.ftpUserAndPass} ${env.folderPath} ./build/*"
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