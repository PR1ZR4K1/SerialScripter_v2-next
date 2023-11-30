 #!/bin/sh

sudo docker-compose up -d
sleep 2
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
sleep 2

# if command -v your_command_name >/dev/null 2>&1; then
#     echo "Command exists."
# else

#     echo "Installing ansible baby..."
#     python3 -m pip install --user pipx
#     python3 -m pipx ensurepath
#     pipx install --include-deps ansible
# fi

# echo "adding ansible playbooks to /opt/memento/ansible"

# sudo mkdir -p /opt/memento/ansible/playbook




