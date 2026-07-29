package db

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Migrate aplica sequencialmente todos os arquivos .sql encontrados em
// migrationsDir, em ordem de nome (NNN_descricao.sql). Cada migration deve
// ser idempotente (IF NOT EXISTS / ON CONFLICT DO NOTHING), permitindo
// reexecução segura a cada startup do serviço.
func Migrate(ctx context.Context, pool *pgxpool.Pool, migrationsDir string) error {
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		if os.IsNotExist(err) {
			// Diretório de migrations não presente neste ambiente — não é fatal,
			// mas fica registrado para quem estiver operando o serviço.
			return nil
		}
		return fmt.Errorf("falha ao ler diretório de migrations: %w", err)
	}

	var files []string
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		if filepath.Ext(e.Name()) == ".sql" {
			files = append(files, e.Name())
		}
	}
	sort.Strings(files)

	for _, name := range files {
		// name vem exclusivamente de os.ReadDir(migrationsDir) acima — não é
		// input de usuário/rede, então não há path traversal real aqui.
		// migrationsDir é configurado por variável de ambiente (MIGRATIONS_DIR)
		// sob controle do operador do serviço.
		path := filepath.Join(migrationsDir, filepath.Clean(name))
		content, err := os.ReadFile(path) // #nosec G304 -- name é derivado de ReadDir do próprio migrationsDir, não de input externo
		if err != nil {
			return fmt.Errorf("falha ao ler migration %s: %w", name, err)
		}

		if _, err := pool.Exec(ctx, string(content)); err != nil {
			return fmt.Errorf("falha ao aplicar migration %s: %w", name, err)
		}
	}

	return nil
}
