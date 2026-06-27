Vagrant.configure("2") do |config|


  # VM 1 — Jenkins Master (runs Jenkins in Docker)

  config.vm.define "jenkins-master" do |master|
    master.vm.box = "ubuntu/focal64"
    master.vm.hostname = "jenkins-master"

    master.vm.network "private_network", ip: "192.168.56.10"
    master.vm.network "forwarded_port", guest: 8080, host: 8080

    master.vm.provider "virtualbox" do |vb|
      vb.name   = "jenkins-master"
      vb.memory = "2048"
      vb.cpus   = 2
    end

    master.vm.provision "shell", inline: <<-SHELL
      set -e

      echo "=== Update system ==="
      apt-get update -y
      apt-get upgrade -y

      echo "=== Install Docker ==="
      apt-get install -y ca-certificates curl gnupg lsb-release
      mkdir -p /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
        | tee /etc/apt/sources.list.d/docker.list > /dev/null
      apt-get update -y
      apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

      usermod -aG docker vagrant
      systemctl enable docker
      systemctl start docker

      echo "=== Run Jenkins in Docker ==="
      docker volume create jenkins_home

      docker run -d \
        --name jenkins \
        --restart=unless-stopped \
        -p 8080:8080 \
        -p 50000:50000 \
        -v jenkins_home:/var/jenkins_home \
        -v /var/run/docker.sock:/var/run/docker.sock \
        jenkins/jenkins:lts

      echo "=== Waiting for Jenkins to start ==="
      sleep 30

      echo ""
      echo "============================================"
      echo " Jenkins Master is ready!"
      echo " URL: http://192.168.56.10:8080"
      echo " Initial admin password:"
      docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || \
        echo " (wait ~1 min then run: docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword)"
      echo "============================================"
    SHELL
  end

  # ──────────────────────────────────────────────
  # VM 2 — Jenkins Worker
  # ──────────────────────────────────────────────
  config.vm.define "jenkins-worker" do |worker|
    worker.vm.box = "ubuntu/focal64"
    worker.vm.hostname = "jenkins-worker"

    worker.vm.network "private_network", ip: "192.168.56.11"

    worker.vm.provider "virtualbox" do |vb|
      vb.name   = "jenkins-worker"
      vb.memory = "2048"
      vb.cpus   = 2
    end

    worker.vm.provision "shell", inline: <<-SHELL
      set -e

      echo "=== Update system ==="
      apt-get update -y
      apt-get upgrade -y

      echo "=== Install Java 21  ==="
      apt-get install -y openjdk-21-jdk
      update-alternatives --set java /usr/lib/jvm/java-21-openjdk-amd64/bin/java

      echo "=== Install Docker ==="
      apt-get install -y ca-certificates curl gnupg lsb-release
      mkdir -p /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
        | tee /etc/apt/sources.list.d/docker.list > /dev/null
      apt-get update -y
      apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

      usermod -aG docker vagrant
      systemctl enable docker
      systemctl start docker

      echo "=== Install Git ==="
      apt-get install -y git

      echo "=== Create Jenkins workspace directory  ==="
      mkdir -p /opt/jenkins-agent
      chown -R vagrant:vagrant /opt/jenkins-agent

      echo "=== Download Jenkins agent jar ==="
      curl -sO http://192.168.56.10:8080/jnlpJars/agent.jar || \
        echo "Jenkins master not ready yet — download agent.jar manually later"
      chown vagrant:vagrant /home/vagrant/agent.jar 2>/dev/null || true

      echo ""
      echo "============================================"
      echo " Jenkins Worker is ready!"
      echo " Java: $(java -version 2>&1 | head -1)"
      echo " Docker: $(docker --version)"
      echo ""
      echo " NEXT STEP: get secret token from Jenkins UI:"
      echo " Manage Jenkins → Nodes → worker → secret"
      echo ""
      echo " Then run on this VM:"
      echo ' sudo SECRET="secret" bash /home/vagrant/start-agent.sh'
      echo "============================================"
    SHELL
  end

end
