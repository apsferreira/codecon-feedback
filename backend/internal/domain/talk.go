package domain

// Talk representa uma palestra do evento.
type Talk struct {
	Slug        string `json:"slug"`
	Title       string `json:"title"`
	Speaker     string `json:"speaker"`
	Description string `json:"description"`
}

// Talks hardcoded do evento Codecon Meetup Salvador.
var Talks = []Talk{
	{
		Slug:        "sdd-sopa",
		Title:       "SDD: para além da sopa de letrinhas",
		Speaker:     "Antonio Pedro Ferreira",
		Description: "Spec Driven Development na prática com show me the code ao vivo",
	},
	{
		Slug:        "a-definir",
		Title:       "(a definir)",
		Speaker:     "(a definir)",
		Description: "(a definir)",
	},
}

// FindTalk busca uma talk pelo slug. Retorna nil se não encontrada.
func FindTalk(slug string) *Talk {
	for i := range Talks {
		if Talks[i].Slug == slug {
			return &Talks[i]
		}
	}
	return nil
}
