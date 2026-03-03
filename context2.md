Directory structure:
└── agentscope-ai-agentscope/
    ├── README.md
    ├── CONTRIBUTING.md
    ├── CONTRIBUTING_zh.md
    ├── LICENSE
    ├── pyproject.toml
    ├── README_zh.md
    ├── .pre-commit-config.yaml
    ├── docs/
    │   ├── changelog.md
    │   ├── NEWS.md
    │   ├── NEWS_zh.md
    │   ├── roadmap.md
    │   └── tutorial/
    │       ├── _static/
    │       │   ├── language_switch.js
    │       │   ├── css/
    │       │   │   └── gallery.css
    │       │   └── images/
    │       │       └── studio_project.webp
    │       ├── _templates/
    │       │   ├── module.rst_t
    │       │   ├── package.rst_t
    │       │   ├── page.html
    │       │   ├── components/
    │       │   │   └── language-switch.html
    │       │   └── sidebar/
    │       │       └── navigation.html
    │       ├── en/
    │       │   ├── build.sh
    │       │   ├── conf.py
    │       │   ├── index.rst
    │       │   ├── make.bat
    │       │   ├── Makefile
    │       │   └── src/
    │       │       ├── README.md
    │       │       ├── faq.py
    │       │       ├── quickstart_agent.py
    │       │       ├── quickstart_installation.py
    │       │       ├── quickstart_key_concept.py
    │       │       ├── quickstart_message.py
    │       │       ├── task_a2a.py
    │       │       ├── task_agent.py
    │       │       ├── task_agent_skill.py
    │       │       ├── task_embedding.py
    │       │       ├── task_eval.py
    │       │       ├── task_eval_openjudge.py
    │       │       ├── task_hook.py
    │       │       ├── task_long_term_memory.py
    │       │       ├── task_mcp.py
    │       │       ├── task_memory.py
    │       │       ├── task_middleware.py
    │       │       ├── task_model.py
    │       │       ├── task_pipeline.py
    │       │       ├── task_plan.py
    │       │       ├── task_prompt.py
    │       │       ├── task_rag.py
    │       │       ├── task_realtime.py
    │       │       ├── task_state.py
    │       │       ├── task_studio.py
    │       │       ├── task_token.py
    │       │       ├── task_tool.py
    │       │       ├── task_tracing.py
    │       │       ├── task_tts.py
    │       │       ├── task_tuner.py
    │       │       ├── workflow_concurrent_agents.py
    │       │       ├── workflow_conversation.py
    │       │       ├── workflow_handoffs.py
    │       │       ├── workflow_multiagent_debate.py
    │       │       └── workflow_routing.py
    │       └── zh_CN/
    │           ├── build.sh
    │           ├── conf.py
    │           ├── index.rst
    │           ├── make.bat
    │           ├── Makefile
    │           └── src/
    │               ├── README.md
    │               ├── faq.py
    │               ├── quickstart_agent.py
    │               ├── quickstart_installation.py
    │               ├── quickstart_key_concept.py
    │               ├── quickstart_message.py
    │               ├── task_a2a.py
    │               ├── task_agent.py
    │               ├── task_agent_skill.py
    │               ├── task_embedding.py
    │               ├── task_eval.py
    │               ├── task_eval_openjudge.py
    │               ├── task_hook.py
    │               ├── task_long_term_memory.py
    │               ├── task_mcp.py
    │               ├── task_memory.py
    │               ├── task_middleware.py
    │               ├── task_model.py
    │               ├── task_pipeline.py
    │               ├── task_plan.py
    │               ├── task_prompt.py
    │               ├── task_rag.py
    │               ├── task_realtime.py
    │               ├── task_state.py
    │               ├── task_studio.py
    │               ├── task_token.py
    │               ├── task_tool.py
    │               ├── task_tracing.py
    │               ├── task_tts.py
    │               ├── task_tuner.py
    │               ├── workflow_concurrent_agents.py
    │               ├── workflow_conversation.py
    │               ├── workflow_handoffs.py
    │               ├── workflow_multiagent_debate.py
    │               └── workflow_routing.py
    ├── examples/
    │   ├── agent/
    │   │   ├── a2a_agent/
    │   │   │   ├── README.md
    │   │   │   ├── agent_card.py
    │   │   │   ├── main.py
    │   │   │   └── setup_a2a_server.py
    │   │   ├── a2ui_agent/
    │   │   │   ├── README.md
    │   │   │   └── samples/
    │   │   │       ├── client/
    │   │   │       │   ├── a2a_client.py
    │   │   │       │   └── lit/
    │   │   │       │       ├── package.json
    │   │   │       │       ├── contact/
    │   │   │       │       │   ├── README.md
    │   │   │       │       │   ├── client.ts
    │   │   │       │       │   ├── contact.ts
    │   │   │       │       │   ├── index.html
    │   │   │       │       │   ├── package.json
    │   │   │       │       │   ├── tsconfig.json
    │   │   │       │       │   ├── vite.config.ts
    │   │   │       │       │   ├── events/
    │   │   │       │       │   │   └── events.ts
    │   │   │       │       │   ├── middleware/
    │   │   │       │       │   │   ├── a2a.ts
    │   │   │       │       │   │   └── index.ts
    │   │   │       │       │   ├── theme/
    │   │   │       │       │   │   └── theme.ts
    │   │   │       │       │   ├── types/
    │   │   │       │       │   │   └── types.ts
    │   │   │       │       │   └── ui/
    │   │   │       │       │       ├── snackbar.ts
    │   │   │       │       │       ├── ui.ts
    │   │   │       │       │       └── custom-components/
    │   │   │       │       │           ├── README.md
    │   │   │       │       │           ├── org-chart.ts
    │   │   │       │       │           ├── premium-text-field.ts
    │   │   │       │       │           ├── register-components.ts
    │   │   │       │       │           └── test/
    │   │   │       │       │               ├── README.md
    │   │   │       │       │               ├── org-chart-test.html
    │   │   │       │       │               ├── override-test.html
    │   │   │       │       │               └── override-test.ts
    │   │   │       │       └── shell/
    │   │   │       │           ├── README.md
    │   │   │       │           ├── app.ts
    │   │   │       │           ├── client.ts
    │   │   │       │           ├── index.html
    │   │   │       │           ├── package.json
    │   │   │       │           ├── THEMING.md
    │   │   │       │           ├── tsconfig.json
    │   │   │       │           ├── vite.config.ts
    │   │   │       │           ├── configs/
    │   │   │       │           │   ├── contacts.ts
    │   │   │       │           │   ├── restaurant.ts
    │   │   │       │           │   └── types.ts
    │   │   │       │           ├── events/
    │   │   │       │           │   └── events.ts
    │   │   │       │           ├── middleware/
    │   │   │       │           │   ├── a2a.ts
    │   │   │       │           │   └── index.ts
    │   │   │       │           ├── theme/
    │   │   │       │           │   ├── clone-default-theme.ts
    │   │   │       │           │   └── default-theme.ts
    │   │   │       │           ├── types/
    │   │   │       │           │   └── types.ts
    │   │   │       │           └── ui/
    │   │   │       │               ├── snackbar.ts
    │   │   │       │               └── ui.ts
    │   │   │       └── general_agent/
    │   │   │           ├── __main__.py
    │   │   │           ├── a2ui_utils.py
    │   │   │           ├── agent_card.py
    │   │   │           ├── prompt_builder.py
    │   │   │           ├── pyproject.toml
    │   │   │           ├── setup_a2ui_server.py
    │   │   │           └── skills/
    │   │   │               └── A2UI_response_generator/
    │   │   │                   ├── __init__.py
    │   │   │                   ├── SKILL.md
    │   │   │                   ├── view_a2ui_examples.py
    │   │   │                   ├── view_a2ui_schema.py
    │   │   │                   ├── schema/
    │   │   │                   │   ├── __init__.py
    │   │   │                   │   └── base_schema.py
    │   │   │                   └── UI_templete_examples/
    │   │   │                       ├── __init__.py
    │   │   │                       ├── booking_form.py
    │   │   │                       ├── contact_form.py
    │   │   │                       ├── email_compose_form.py
    │   │   │                       ├── error_message.py
    │   │   │                       ├── info_message.py
    │   │   │                       ├── item_detail_card_with_image.py
    │   │   │                       ├── profile_view.py
    │   │   │                       ├── search_filter_form.py
    │   │   │                       ├── selection_card.py
    │   │   │                       ├── simple_column_list_without_image.py
    │   │   │                       ├── single_column_list.py
    │   │   │                       ├── success_confirmation_with_image.py
    │   │   │                       └── two_column_list.py
    │   │   ├── browser_agent/
    │   │   │   ├── README.md
    │   │   │   ├── browser_agent.py
    │   │   │   ├── main.py
    │   │   │   ├── build_in_helper/
    │   │   │   │   ├── _file_download.py
    │   │   │   │   ├── _form_filling.py
    │   │   │   │   ├── _image_understanding.py
    │   │   │   │   └── _video_understanding.py
    │   │   │   └── build_in_prompt/
    │   │   │       ├── browser_agent_decompose_reflection_prompt.md
    │   │   │       ├── browser_agent_file_download_sys_prompt.md
    │   │   │       ├── browser_agent_form_filling_sys_prompt.md
    │   │   │       ├── browser_agent_observe_reasoning_prompt.md
    │   │   │       ├── browser_agent_pure_reasoning_prompt.md
    │   │   │       ├── browser_agent_subtask_revise_prompt.md
    │   │   │       ├── browser_agent_summarize_task.md
    │   │   │       ├── browser_agent_sys_prompt.md
    │   │   │       └── browser_agent_task_decomposition_prompt.md
    │   │   ├── deep_research_agent/
    │   │   │   ├── README.md
    │   │   │   ├── deep_research_agent.py
    │   │   │   ├── main.py
    │   │   │   ├── utils.py
    │   │   │   └── built_in_prompt/
    │   │   │       ├── prompt_decompose_subtask.md
    │   │   │       ├── prompt_deeper_expansion.md
    │   │   │       ├── prompt_deepresearch_summary_report.md
    │   │   │       ├── prompt_inprocess_report.md
    │   │   │       ├── prompt_reflect_failure.md
    │   │   │       ├── prompt_tool_usage_rules.md
    │   │   │       ├── prompt_worker_additional_sys_prompt.md
    │   │   │       └── promptmodule.py
    │   │   ├── meta_planner_agent/
    │   │   │   ├── README.md
    │   │   │   ├── main.py
    │   │   │   └── tool.py
    │   │   ├── react_agent/
    │   │   │   ├── README.md
    │   │   │   └── main.py
    │   │   ├── realtime_voice_agent/
    │   │   │   ├── README.md
    │   │   │   └── run_server.py
    │   │   └── voice_agent/
    │   │       ├── README.md
    │   │       └── main.py
    │   ├── deployment/
    │   │   ├── README.md
    │   │   └── planning_agent/
    │   │       ├── README.md
    │   │       ├── main.py
    │   │       ├── test_post.py
    │   │       └── tool.py
    │   ├── evaluation/
    │   │   └── ace_bench/
    │   │       ├── README.md
    │   │       └── main.py
    │   ├── functionality/
    │   │   ├── agent_skill/
    │   │   │   ├── README.md
    │   │   │   ├── main.py
    │   │   │   └── skill/
    │   │   │       └── analyzing-agentscope-library/
    │   │   │           ├── SKILL.md
    │   │   │           └── view_agentscope_module.py
    │   │   ├── long_term_memory/
    │   │   │   ├── mem0/
    │   │   │   │   ├── README.md
    │   │   │   │   └── memory_example.py
    │   │   │   └── reme/
    │   │   │       ├── README.md
    │   │   │       ├── personal_memory_example.py
    │   │   │       ├── task_memory_example.py
    │   │   │       └── tool_memory_example.py
    │   │   ├── mcp/
    │   │   │   ├── README.md
    │   │   │   ├── main.py
    │   │   │   ├── mcp_add.py
    │   │   │   └── mcp_multiply.py
    │   │   ├── plan/
    │   │   │   ├── README.md
    │   │   │   ├── main_agent_managed_plan.py
    │   │   │   └── main_manual_plan.py
    │   │   ├── rag/
    │   │   │   ├── README.md
    │   │   │   ├── agentic_usage.py
    │   │   │   ├── basic_usage.py
    │   │   │   ├── multimodal_rag.py
    │   │   │   └── react_agent_integration.py
    │   │   ├── session_with_sqlite/
    │   │   │   ├── README.md
    │   │   │   ├── main.py
    │   │   │   └── sqlite_session.py
    │   │   ├── short_term_memory/
    │   │   │   ├── memory_compression/
    │   │   │   │   ├── README.md
    │   │   │   │   └── main.py
    │   │   │   └── reme/
    │   │   │       ├── README.md
    │   │   │       ├── reme_short_term_memory.py
    │   │   │       └── short_term_memory_example.py
    │   │   ├── stream_printing_messages/
    │   │   │   ├── README.md
    │   │   │   ├── multi_agent.py
    │   │   │   └── single_agent.py
    │   │   ├── structured_output/
    │   │   │   ├── README.md
    │   │   │   └── main.py
    │   │   ├── tts/
    │   │   │   ├── README.md
    │   │   │   └── main.py
    │   │   └── vector_store/
    │   │       ├── alibabacloud_mysql_vector/
    │   │       │   ├── README.md
    │   │       │   └── main.py
    │   │       ├── milvus_lite/
    │   │       │   ├── README.md
    │   │       │   └── main.py
    │   │       ├── mongodb/
    │   │       │   ├── README.md
    │   │       │   └── main.py
    │   │       └── oceanbase/
    │   │           ├── README.md
    │   │           └── main.py
    │   ├── game/
    │   │   └── werewolves/
    │   │       ├── README.md
    │   │       ├── game.py
    │   │       ├── main.py
    │   │       ├── prompt.py
    │   │       ├── structured_model.py
    │   │       └── utils.py
    │   ├── integration/
    │   │   ├── alibabacloud_api_mcp/
    │   │   │   ├── README.md
    │   │   │   ├── main.py
    │   │   │   └── oauth_handler.py
    │   │   └── qwen_deep_research_model/
    │   │       ├── README.md
    │   │       ├── main.py
    │   │       └── qwen_deep_research_agent.py
    │   ├── tuner/
    │   │   └── react_agent/
    │   │       ├── README.md
    │   │       ├── config.yaml
    │   │       └── main.py
    │   └── workflows/
    │       ├── multiagent_concurrent/
    │       │   ├── README.md
    │       │   └── main.py
    │       ├── multiagent_conversation/
    │       │   ├── README.md
    │       │   └── main.py
    │       ├── multiagent_debate/
    │       │   ├── README.md
    │       │   └── main.py
    │       └── multiagent_realtime/
    │           ├── README.md
    │           ├── multi_agent.html
    │           └── run_server.py
    ├── src/
    │   └── agentscope/
    │       ├── __init__.py
    │       ├── _logging.py
    │       ├── _run_config.py
    │       ├── _version.py
    │       ├── py.typed
    │       ├── _utils/
    │       │   ├── __init__.py
    │       │   ├── _common.py
    │       │   └── _mixin.py
    │       ├── a2a/
    │       │   ├── __init__.py
    │       │   ├── _base.py
    │       │   ├── _file_resolver.py
    │       │   ├── _nacos_resolver.py
    │       │   └── _well_known_resolver.py
    │       ├── agent/
    │       │   ├── __init__.py
    │       │   ├── _a2a_agent.py
    │       │   ├── _agent_base.py
    │       │   ├── _agent_meta.py
    │       │   ├── _react_agent.py
    │       │   ├── _react_agent_base.py
    │       │   ├── _realtime_agent.py
    │       │   ├── _user_agent.py
    │       │   ├── _user_input.py
    │       │   └── _utils.py
    │       ├── embedding/
    │       │   ├── __init__.py
    │       │   ├── _cache_base.py
    │       │   ├── _dashscope_embedding.py
    │       │   ├── _dashscope_multimodal_embedding.py
    │       │   ├── _embedding_base.py
    │       │   ├── _embedding_response.py
    │       │   ├── _embedding_usage.py
    │       │   ├── _file_cache.py
    │       │   ├── _gemini_embedding.py
    │       │   ├── _ollama_embedding.py
    │       │   └── _openai_embedding.py
    │       ├── evaluate/
    │       │   ├── __init__.py
    │       │   ├── _benchmark_base.py
    │       │   ├── _metric_base.py
    │       │   ├── _solution.py
    │       │   ├── _task.py
    │       │   ├── _ace_benchmark/
    │       │   │   ├── __init__.py
    │       │   │   ├── _ace_benchmark.py
    │       │   │   ├── _ace_metric.py
    │       │   │   ├── _ace_tools_zh.py
    │       │   │   └── _ace_tools_api/
    │       │   │       ├── __init__.py
    │       │   │       ├── _food_platform_api.py
    │       │   │       ├── _message_api.py
    │       │   │       ├── _reminder_api.py
    │       │   │       ├── _shared_state.py
    │       │   │       └── _travel_api.py
    │       │   ├── _evaluator/
    │       │   │   ├── __init__.py
    │       │   │   ├── _evaluator_base.py
    │       │   │   ├── _general_evaluator.py
    │       │   │   ├── _in_memory_exporter.py
    │       │   │   └── _ray_evaluator.py
    │       │   └── _evaluator_storage/
    │       │       ├── __init__.py
    │       │       ├── _evaluator_storage_base.py
    │       │       └── _file_evaluator_storage.py
    │       ├── exception/
    │       │   ├── __init__.py
    │       │   ├── _exception_base.py
    │       │   └── _tool.py
    │       ├── formatter/
    │       │   ├── __init__.py
    │       │   ├── _a2a_formatter.py
    │       │   ├── _anthropic_formatter.py
    │       │   ├── _dashscope_formatter.py
    │       │   ├── _deepseek_formatter.py
    │       │   ├── _formatter_base.py
    │       │   ├── _gemini_formatter.py
    │       │   ├── _ollama_formatter.py
    │       │   ├── _openai_formatter.py
    │       │   └── _truncated_formatter_base.py
    │       ├── hooks/
    │       │   ├── __init__.py
    │       │   └── _studio_hooks.py
    │       ├── mcp/
    │       │   ├── __init__.py
    │       │   ├── _client_base.py
    │       │   ├── _http_stateful_client.py
    │       │   ├── _http_stateless_client.py
    │       │   ├── _mcp_function.py
    │       │   ├── _stateful_client_base.py
    │       │   └── _stdio_stateful_client.py
    │       ├── memory/
    │       │   ├── __init__.py
    │       │   ├── _long_term_memory/
    │       │   │   ├── __init__.py
    │       │   │   ├── _long_term_memory_base.py
    │       │   │   ├── _mem0/
    │       │   │   │   ├── __init__.py
    │       │   │   │   ├── _mem0_long_term_memory.py
    │       │   │   │   └── _mem0_utils.py
    │       │   │   └── _reme/
    │       │   │       ├── __init__.py
    │       │   │       ├── _reme_long_term_memory_base.py
    │       │   │       ├── _reme_personal_long_term_memory.py
    │       │   │       ├── _reme_task_long_term_memory.py
    │       │   │       └── _reme_tool_long_term_memory.py
    │       │   └── _working_memory/
    │       │       ├── __init__.py
    │       │       ├── _base.py
    │       │       ├── _in_memory_memory.py
    │       │       ├── _redis_memory.py
    │       │       └── _sqlalchemy_memory.py
    │       ├── message/
    │       │   ├── __init__.py
    │       │   ├── _message_base.py
    │       │   └── _message_block.py
    │       ├── model/
    │       │   ├── __init__.py
    │       │   ├── _anthropic_model.py
    │       │   ├── _dashscope_model.py
    │       │   ├── _gemini_model.py
    │       │   ├── _model_base.py
    │       │   ├── _model_response.py
    │       │   ├── _model_usage.py
    │       │   ├── _ollama_model.py
    │       │   ├── _openai_model.py
    │       │   └── _trinity_model.py
    │       ├── module/
    │       │   ├── __init__.py
    │       │   └── _state_module.py
    │       ├── pipeline/
    │       │   ├── __init__.py
    │       │   ├── _chat_room.py
    │       │   ├── _class.py
    │       │   ├── _functional.py
    │       │   └── _msghub.py
    │       ├── plan/
    │       │   ├── __init__.py
    │       │   ├── _in_memory_storage.py
    │       │   ├── _plan_model.py
    │       │   ├── _plan_notebook.py
    │       │   └── _storage_base.py
    │       ├── rag/
    │       │   ├── __init__.py
    │       │   ├── _document.py
    │       │   ├── _knowledge_base.py
    │       │   ├── _simple_knowledge.py
    │       │   ├── _reader/
    │       │   │   ├── __init__.py
    │       │   │   ├── _excel_reader.py
    │       │   │   ├── _image_reader.py
    │       │   │   ├── _pdf_reader.py
    │       │   │   ├── _ppt_reader.py
    │       │   │   ├── _reader_base.py
    │       │   │   ├── _text_reader.py
    │       │   │   ├── _utils.py
    │       │   │   └── _word_reader.py
    │       │   └── _store/
    │       │       ├── __init__.py
    │       │       ├── _alibabacloud_mysql_store.py
    │       │       ├── _milvuslite_store.py
    │       │       ├── _mongodb_store.py
    │       │       ├── _oceanbase_store.py
    │       │       ├── _qdrant_store.py
    │       │       └── _store_base.py
    │       ├── realtime/
    │       │   ├── __init__.py
    │       │   ├── _base.py
    │       │   ├── _dashscope_realtime_model.py
    │       │   ├── _gemini_realtime_model.py
    │       │   ├── _openai_realtime_model.py
    │       │   └── _events/
    │       │       ├── __init__.py
    │       │       ├── _client_event.py
    │       │       ├── _model_event.py
    │       │       ├── _server_event.py
    │       │       └── _utils.py
    │       ├── session/
    │       │   ├── __init__.py
    │       │   ├── _json_session.py
    │       │   ├── _redis_session.py
    │       │   └── _session_base.py
    │       ├── token/
    │       │   ├── __init__.py
    │       │   ├── _anthropic_token_counter.py
    │       │   ├── _char_token_counter.py
    │       │   ├── _gemini_token_counter.py
    │       │   ├── _huggingface_token_counter.py
    │       │   ├── _openai_token_counter.py
    │       │   └── _token_base.py
    │       ├── tool/
    │       │   ├── __init__.py
    │       │   ├── _async_wrapper.py
    │       │   ├── _response.py
    │       │   ├── _toolkit.py
    │       │   ├── _types.py
    │       │   ├── _coding/
    │       │   │   ├── __init__.py
    │       │   │   ├── _python.py
    │       │   │   └── _shell.py
    │       │   ├── _multi_modality/
    │       │   │   ├── __init__.py
    │       │   │   ├── _dashscope_tools.py
    │       │   │   └── _openai_tools.py
    │       │   └── _text_file/
    │       │       ├── __init__.py
    │       │       ├── _utils.py
    │       │       ├── _view_text_file.py
    │       │       └── _write_text_file.py
    │       ├── tracing/
    │       │   ├── __init__.py
    │       │   ├── _attributes.py
    │       │   ├── _converter.py
    │       │   ├── _extractor.py
    │       │   ├── _setup.py
    │       │   ├── _trace.py
    │       │   └── _utils.py
    │       ├── tts/
    │       │   ├── __init__.py
    │       │   ├── _dashscope_cosyvoice_realtime_tts_model.py
    │       │   ├── _dashscope_cosyvoice_tts_model.py
    │       │   ├── _dashscope_realtime_tts_model.py
    │       │   ├── _dashscope_tts_model.py
    │       │   ├── _gemini_tts_model.py
    │       │   ├── _openai_tts_model.py
    │       │   ├── _tts_base.py
    │       │   ├── _tts_response.py
    │       │   └── _utils.py
    │       ├── tune/
    │       │   └── __init__.py
    │       ├── tuner/
    │       │   ├── __init__.py
    │       │   ├── _algorithm.py
    │       │   ├── _config.py
    │       │   ├── _dataset.py
    │       │   ├── _judge.py
    │       │   ├── _model.py
    │       │   ├── _tune.py
    │       │   └── _workflow.py
    │       └── types/
    │           ├── __init__.py
    │           ├── _hook.py
    │           ├── _json.py
    │           ├── _object.py
    │           └── _tool.py
    ├── tests/
    │   ├── a2a_agent_test.py
    │   ├── a2a_resolver_test.py
    │   ├── config_test.py
    │   ├── embedding_cache_test.py
    │   ├── evaluation_test.py
    │   ├── formatter_a2a_test.py
    │   ├── formatter_anthropic_test.py
    │   ├── formatter_dashscope_test.py
    │   ├── formatter_deepseek_test.py
    │   ├── formatter_gemini_test.py
    │   ├── formatter_ollama_test.py
    │   ├── formatter_openai_test.py
    │   ├── hook_test.py
    │   ├── mcp_sse_client_test.py
    │   ├── mcp_streamable_http_client_test.py
    │   ├── mem0_utils_test.py
    │   ├── memory_compression_test.py
    │   ├── memory_reme_test.py
    │   ├── memory_test.py
    │   ├── model_anthropic_test.py
    │   ├── model_dashscope_test.py
    │   ├── model_gemini_test.py
    │   ├── model_ollama_test.py
    │   ├── model_openai_test.py
    │   ├── pipeline_test.py
    │   ├── plan_test.py
    │   ├── rag_knowledge_test.py
    │   ├── rag_reader_test.py
    │   ├── rag_store_test.py
    │   ├── react_agent_test.py
    │   ├── realtime_dashscope_test.py
    │   ├── realtime_event_test.py
    │   ├── realtime_gemini_test.py
    │   ├── realtime_openai_test.py
    │   ├── session_test.py
    │   ├── token_anthropic_test.py
    │   ├── token_char_test.py
    │   ├── token_openai_test.py
    │   ├── tool_dashscope_test.py
    │   ├── tool_openai_test.py
    │   ├── tool_test.py
    │   ├── toolkit_basic_test.py
    │   ├── toolkit_meta_tool_test.py
    │   ├── toolkit_middleware_test.py
    │   ├── tracing_converter_test.py
    │   ├── tracing_extractor_test.py
    │   ├── tracing_test.py
    │   ├── tracing_utils_test.py
    │   ├── tts_dashscope_cosyvoice_test.py
    │   ├── tts_dashscope_test.py
    │   ├── tts_gemini_test.py
    │   ├── tts_openai_test.py
    │   ├── tuner_test.py
    │   └── user_input_test.py
    ├── .gemini/
    │   └── styleguide.md
    └── .github/
        ├── copilot-instructions.md
        ├── PULL_REQUEST_TEMPLATE.md
        ├── ISSUE_TEMPLATE/
        │   ├── bug_report.md
        │   ├── custom.md
        │   └── feature_request.md
        ├── scripts/
        │   └── update_news.py
        └── workflows/
            ├── pr-title-check.yml
            ├── pre-commit.yml
            ├── publish-pypi.yml
            ├── sphinx_docs.yml
            ├── stale.yml
            ├── toc.yml
            ├── unittest.yml
            └── update_news.yml


Files Content:

(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: README.md
================================================
<p align="center">
  <img
    src="https://img.alicdn.com/imgextra/i1/O1CN01nTg6w21NqT5qFKH1u_!!6000000001621-55-tps-550-550.svg"
    alt="AgentScope Logo"
    width="200"
  />
</p>

<span align="center">

[**中文主页**](https://github.com/agentscope-ai/agentscope/blob/main/README_zh.md) | [**Tutorial**](https://doc.agentscope.io/) | [**Roadmap (Jan 2026 -)**](https://github.com/agentscope-ai/agentscope/blob/main/docs/roadmap.md) | [**FAQ**](https://doc.agentscope.io/tutorial/faq.html)

</span>

<p align="center">
    <a href="https://arxiv.org/abs/2402.14034">
        <img
            src="https://img.shields.io/badge/cs.MA-2402.14034-B31C1C?logo=arxiv&logoColor=B31C1C"
            alt="arxiv"
        />
    </a>
    <a href="https://pypi.org/project/agentscope/">
        <img
            src="https://img.shields.io/badge/python-3.10+-blue?logo=python"
            alt="pypi"
        />
    </a>
    <a href="https://pypi.org/project/agentscope/">
        <img
            src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fpypi.org%2Fpypi%2Fagentscope%2Fjson&query=%24.info.version&prefix=v&logo=pypi&label=version"
            alt="pypi"
        />
    </a>
    <a href="https://discord.gg/eYMpfnkG8h">
        <img
            src="https://img.shields.io/discord/1194846673529213039?label=Discord&logo=discord"
            alt="discord"
        />
    </a>
    <a href="https://doc.agentscope.io/">
        <img
            src="https://img.shields.io/badge/Docs-English%7C%E4%B8%AD%E6%96%87-blue?logo=markdown"
            alt="docs"
        />
    </a>
    <a href="./LICENSE">
        <img
            src="https://img.shields.io/badge/license-Apache--2.0-black"
            alt="license"
        />
    </a>
</p>

<p align="center">
<img src="https://trendshift.io/api/badge/repositories/10079" alt="modelscope%2Fagentscope | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/>
</p>

## What is AgentScope?

AgentScope is a production-ready, easy-to-use agent framework with essential abstractions that work with rising model capability and built-in support for finetuning.

We design for increasingly agentic LLMs.
Our approach leverages the models' reasoning and tool use abilities
rather than constraining them with strict prompts and opinionated orchestrations.

## Why use AgentScope?

- **Simple**: start building your agents in 5 minutes with built-in ReAct agent, tools, skills, human-in-the-loop steering, memory, planning, realtime voice, evaluation and model finetuning
- **Extensible**: large number of ecosystem integrations for tools, memory and observability; built-in support for MCP and A2A; message hub for flexible multi-agent orchestration and workflows
- **Production-ready**: deploy and serve your agents locally, as serverless in the cloud, or on your K8s cluster with built-in OTel support


<p align="center">
<img src="./assets/images/agentscope_20260120.png" width="90%" />
<br/>
The AgentScope Ecosystem
</p>


## News
<!-- BEGIN NEWS -->
- **[2026-02] `FEAT`:** Realtime Voice Agent support. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent) | [Multi-Agent Realtime Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime) | [Tutorial](https://doc.agentscope.io/tutorial/task_realtime.html)
- **[2026-01] `COMM`:** Biweekly Meetings launched to share ecosystem updates and development plans - join us! [Details & Schedule](https://github.com/agentscope-ai/agentscope/discussions/1126)
- **[2026-01] `FEAT`:** Database support & memory compression in memory module. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/short_term_memory/memory_compression) | [Tutorial](https://doc.agentscope.io/tutorial/task_memory.html)
- **[2025-12] `INTG`:** A2A (Agent-to-Agent) protocol support. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/a2a_agent) | [Tutorial](https://doc.agentscope.io/tutorial/task_a2a.html)
- **[2025-12] `FEAT`:** TTS (Text-to-Speech) support. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/tts) | [Tutorial](https://doc.agentscope.io/tutorial/task_tts.html)
- **[2025-11] `INTG`:** Anthropic Agent Skill support. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/agent_skill) | [Tutorial](https://doc.agentscope.io/tutorial/task_agent_skill.html)
- **[2025-11] `RELS`:** Alias-Agent for diverse real-world tasks and Data-Juicer Agent for data processing open-sourced. [Alias-Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/alias) | [Data-Juicer Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/data_juicer_agent)
- **[2025-11] `INTG`:** Agentic RL via Trinity-RFT library. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/tuner/react_agent) | [Trinity-RFT](https://github.com/agentscope-ai/Trinity-RFT)
- **[2025-11] `INTG`:** ReMe for enhanced long-term memory. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/long_term_memory/reme)
- **[2025-11] `RELS`:** agentscope-samples repository launched and agentscope-runtime upgraded with Docker/K8s deployment and VNC-powered GUI sandboxes. [Samples](https://github.com/agentscope-ai/agentscope-samples) | [Runtime](https://github.com/agentscope-ai/agentscope-runtime)
<!-- END NEWS -->

[More news →](./docs/NEWS.md)

## Community

Welcome to join our community on

| [Discord](https://discord.gg/eYMpfnkG8h)                                                                                         | DingTalk                                                                  |
|----------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| <img src="https://gw.alicdn.com/imgextra/i1/O1CN01hhD1mu1Dd3BWVUvxN_!!6000000000238-2-tps-400-400.png" width="100" height="100"> | <img src="./assets/images/dingtalk_qr_code.png" width="100" height="100"> |

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## 📑 Table of Contents

- [Quickstart](#quickstart)
  - [Installation](#installation)
    - [From PyPI](#from-pypi)
    - [From source](#from-source)
- [Example](#example)
  - [Hello AgentScope!](#hello-agentscope)
  - [Voice Agent](#voice-agent)
  - [Realtime Voice Agent](#realtime-voice-agent)
  - [Human-in-the-loop](#human-in-the-loop)
  - [Flexible MCP Usage](#flexible-mcp-usage)
  - [Agentic RL](#agentic-rl)
  - [Multi-Agent Workflows](#multi-agent-workflows)
- [Documentation](#documentation)
- [More Examples & Samples](#more-examples--samples)
  - [Functionality](#functionality)
  - [Agent](#agent)
  - [Game](#game)
  - [Workflow](#workflow)
  - [Evaluation](#evaluation)
  - [Tuner](#tuner)
- [Contributing](#contributing)
- [License](#license)
- [Publications](#publications)
- [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quickstart

### Installation

> AgentScope requires **Python 3.10** or higher.

#### From PyPI

```bash
pip install agentscope
```

Or with uv:

```bash
uv pip install agentscope
```

#### From source

```bash
# Pull the source code from GitHub
git clone -b main https://github.com/agentscope-ai/agentscope.git

# Install the package in editable mode
cd agentscope

pip install -e .
# or with uv:
# uv pip install -e .
```


## Example

### Hello AgentScope!

Start with a conversation between user and a ReAct agent 🤖 named "Friday"!

```python
from agentscope.agent import ReActAgent, UserAgent
from agentscope.model import DashScopeChatModel
from agentscope.formatter import DashScopeChatFormatter
from agentscope.memory import InMemoryMemory
from agentscope.tool import Toolkit, execute_python_code, execute_shell_command
import os, asyncio


async def main():
    toolkit = Toolkit()
    toolkit.register_tool_function(execute_python_code)
    toolkit.register_tool_function(execute_shell_command)

    agent = ReActAgent(
        name="Friday",
        sys_prompt="You're a helpful assistant named Friday.",
        model=DashScopeChatModel(
            model_name="qwen-max",
            api_key=os.environ["DASHSCOPE_API_KEY"],
            stream=True,
        ),
        memory=InMemoryMemory(),
        formatter=DashScopeChatFormatter(),
        toolkit=toolkit,
    )

    user = UserAgent(name="user")

    msg = None
    while True:
        msg = await agent(msg)
        msg = await user(msg)
        if msg.get_text_content() == "exit":
            break

asyncio.run(main())
```

### Voice Agent

Create a voice-enabled ReAct agent that can understand and respond with speech, even playing a multi-agent werewolf game with voice interactions.


https://github.com/user-attachments/assets/c5f05254-aff6-4375-90df-85e8da95d5da


### Realtime Voice Agent

Build a realtime voice agent with web interface that can interact with users via voice input and output.

[Realtime chatbot](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent) | [Realtime Multi-Agent Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime)

https://github.com/user-attachments/assets/1b7b114b-e995-4586-9b3f-d3bb9fcd2558



### Human-in-the-loop

Support realtime interruption in ReActAgent: conversation can be interrupted via cancellation in realtime and resumed
seamlessly via robust memory preservation.

<img src="./assets/images/realtime_steering_en.gif" alt="Realtime Steering" width="60%"/>

### Flexible MCP Usage

Use individual MCP tools as **local callable functions** to compose toolkits or wrap into a more complex tool.

```python
from agentscope.mcp import HttpStatelessClient
from agentscope.tool import Toolkit
import os

async def fine_grained_mcp_control():
    # Initialize the MCP client
    client = HttpStatelessClient(
        name="gaode_mcp",
        transport="streamable_http",
        url=f"https://mcp.amap.com/mcp?key={os.environ['GAODE_API_KEY']}",
    )

    # Obtain the MCP tool as a **local callable function**, and use it anywhere
    func = await client.get_callable_function(func_name="maps_geo")

    # Option 1: Call directly
    await func(address="Tiananmen Square", city="Beijing")

    # Option 2: Pass to agent as a tool
    toolkit = Toolkit()
    toolkit.register_tool_function(func)
    # ...

    # Option 3: Wrap into a more complex tool
    # ...
```

### Agentic RL

Train your agentic application seamlessly with Reinforcement Learning integration. We also prepare multiple sample projects covering various scenarios:

| Example                                                                                          | Description                                                 | Model                  | Training Result             |
|--------------------------------------------------------------------------------------------------|-------------------------------------------------------------|------------------------|-----------------------------|
| [Math Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/math_agent)     | Tune a math-solving agent with multi-step reasoning.        | Qwen3-0.6B             | Accuracy: 75% → 85%         |
| [Frozen Lake](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/frozen_lake)   | Train an agent to navigate the Frozen Lake environment.     | Qwen2.5-3B-Instruct    | Success rate: 15% → 86%     |
| [Learn to Ask](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/learn_to_ask) | Tune agents using LLM-as-a-judge for automated feedback.    | Qwen2.5-7B-Instruct    | Accuracy: 47% → 92%         |
| [Email Search](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/email_search) | Improve tool-use capabilities without labeled ground truth. | Qwen3-4B-Instruct-2507 | Accuracy: 60%               |
| [Werewolf Game](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/werewolves)  | Train agents for strategic multi-agent game interactions.   | Qwen2.5-7B-Instruct    | Werewolf win rate: 50% → 80% |
| [Data Augment](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/data_augment) | Generate synthetic training data to enhance tuning results. | Qwen3-0.6B             | AIME-24 accuracy: 20% → 60% |

### Multi-Agent Workflows

AgentScope provides ``MsgHub`` and pipelines to streamline multi-agent conversations, offering efficient message routing and seamless information sharing

```python
from agentscope.pipeline import MsgHub, sequential_pipeline
from agentscope.message import Msg
import asyncio

async def multi_agent_conversation():
    # Create agents
    agent1 = ...
    agent2 = ...
    agent3 = ...
    agent4 = ...

    # Create a message hub to manage multi-agent conversation
    async with MsgHub(
        participants=[agent1, agent2, agent3],
        announcement=Msg("Host", "Introduce yourselves.", "assistant")
    ) as hub:
        # Speak in a sequential manner
        await sequential_pipeline([agent1, agent2, agent3])
        # Dynamic manage the participants
        hub.add(agent4)
        hub.delete(agent3)
        await hub.broadcast(Msg("Host", "Goodbye!", "assistant"))

asyncio.run(multi_agent_conversation())
```


## Documentation

- [Tutorial](https://doc.agentscope.io/tutorial/)
- [FAQ](https://doc.agentscope.io/tutorial/faq.html)
- [API Docs](https://doc.agentscope.io/api/agentscope.html)

## More Examples & Samples

### Functionality

- [MCP](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/mcp)
- [Anthropic Agent Skill](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/agent_skill)
- [Plan](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/plan)
- [Structured Output](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/structured_output)
- [RAG](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/rag)
- [Long-Term Memory](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/long_term_memory)
- [Session with SQLite](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/session_with_sqlite)
- [Stream Printing Messages](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/stream_printing_messages)
- [TTS](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/tts)
- [Code-first Deployment](https://github.com/agentscope-ai/agentscope/tree/main/examples/deployment/planning_agent)
- [Memory Compression](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/short_term_memory/memory_compression)

### Agent

- [ReAct Agent](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/react_agent)
- [Voice Agent](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/voice_agent)
- [Deep Research Agent](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/deep_research_agent)
- [Browser-use Agent](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/browser_agent)
- [Meta Planner Agent](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/meta_planner_agent)
- [A2A Agent](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/a2a_agent)
- [Realtime Voice Agent](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent)

### Game

- [Nine-player Werewolves](https://github.com/agentscope-ai/agentscope/tree/main/examples/game/werewolves)

### Workflow

- [Multi-agent Debate](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_debate)
- [Multi-agent Conversation](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_conversation)
- [Multi-agent Concurrent](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_concurrent)
- [Multi-agent Realtime Conversation](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime)

### Evaluation

- [ACEBench](https://github.com/agentscope-ai/agentscope/tree/main/examples/evaluation/ace_bench)

### Tuner

- [Tune ReAct Agent](https://github.com/agentscope-ai/agentscope/tree/main/examples/tuner/react_agent)


## Contributing

We welcome contributions from the community! Please refer to our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
on how to contribute.

## License

AgentScope is released under Apache License 2.0.

## Publications

If you find our work helpful for your research or application, please cite our papers.

- [AgentScope 1.0: A Developer-Centric Framework for Building Agentic Applications](https://arxiv.org/abs/2508.16279)

- [AgentScope: A Flexible yet Robust Multi-Agent Platform](https://arxiv.org/abs/2402.14034)

```
@article{agentscope_v1,
    author  = {Dawei Gao, Zitao Li, Yuexiang Xie, Weirui Kuang, Liuyi Yao, Bingchen Qian, Zhijian Ma, Yue Cui, Haohao Luo, Shen Li, Lu Yi, Yi Yu, Shiqi He, Zhiling Luo, Wenmeng Zhou, Zhicheng Zhang, Xuguang He, Ziqian Chen, Weikai Liao, Farruh Isakulovich Kushnazarov, Yaliang Li, Bolin Ding, Jingren Zhou}
    title   = {AgentScope 1.0: A Developer-Centric Framework for Building Agentic Applications},
    journal = {CoRR},
    volume  = {abs/2508.16279},
    year    = {2025},
}

@article{agentscope,
    author  = {Dawei Gao, Zitao Li, Xuchen Pan, Weirui Kuang, Zhijian Ma, Bingchen Qian, Fei Wei, Wenhao Zhang, Yuexiang Xie, Daoyuan Chen, Liuyi Yao, Hongyi Peng, Zeyu Zhang, Lin Zhu, Chen Cheng, Hongzhu Shi, Yaliang Li, Bolin Ding, Jingren Zhou}
    title   = {AgentScope: A Flexible yet Robust Multi-Agent Platform},
    journal = {CoRR},
    volume  = {abs/2402.14034},
    year    = {2024},
}
```

## Contributors

All thanks to our contributors:

<a href="https://github.com/agentscope-ai/agentscope/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=agentscope-ai/agentscope&max=999&columns=12&anon=1" />
</a>



================================================
FILE: CONTRIBUTING.md
================================================
# Contributing to AgentScope

## Welcome! 🎉

Thank you for your interest in contributing to AgentScope! As an open-source project, we warmly welcome and encourage
contributions from the community. Whether you're fixing bugs, adding new features, improving documentation, or sharing
ideas, your contributions help make AgentScope better for everyone.

## How to Contribute

To ensure smooth collaboration and maintain the quality of the project, please follow these guidelines when contributing:

### 1. Check Existing Plans and Issues

Before starting your contribution, please review our development roadmap:

- **Check the [Projects](https://github.com/orgs/agentscope-ai/projects/2) page** and **[Issues with `roadmap` label](https://github.com/agentscope-ai/agentscope/issues?q=is%3Aissue%20state%3Aopen%20label%3ARoadmap)** to see our planned development tasks.

  - **If a related issue exists** and is marked as unassigned or open:
    - Please comment on the issue to express your interest in working on it
    - This helps avoid duplicate efforts and allows us to coordinate development

  - **If no related issue exists**:
    - Please create a new issue describing your proposed changes or feature
    - Our team will respond promptly to provide feedback and guidance
    - This helps us maintain the project roadmap and coordinate community efforts

### 2. Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable
commit history and enables automatic changelog generation.

**Format:**
```
<type>(<scope>): <subject>
```

**Types:**
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `ci:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries

**Examples:**
```bash
feat(models): add support for Claude-3 model
fix(agent): resolve memory leak in ReActAgent
docs(readme): update installation instructions
refactor(formatter): simplify message formatting logic
ci(models): add unit tests for OpenAI integration
```

### 3. Pull Request Title Format

Pull request titles must follow the same [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Format:**
```
<type>(<scope>): <description>
```

**Requirements:**
- The title must start with one of the allowed types: `feat`, `fix`, `docs`, `ci`, `refactor`, `test`, `chore`, `perf`, `style`, `build`, `revert`
- Scope is optional but recommended
- **Scope must be lowercase** - only lowercase letters, numbers, hyphens (`-`), and underscores (`_`) are allowed
- Description should start with a lowercase letter
- Keep the title concise and descriptive

**Examples:**
```
✅ Valid:
feat(memory): add redis cache support
fix(agent): resolve memory leak in ReActAgent
docs(tutorial): update installation guide
ci(workflow): add PR title validation
refactor(my-feature): simplify logic

❌ Invalid:
feat(Memory): add cache          # Scope must be lowercase
feat(MEMORY): add cache          # Scope must be lowercase
feat(MyFeature): add feature     # Scope must be lowercase
```

**Automated Validation:**
- PR titles targeting the `main` branch are automatically validated by GitHub Actions
- PRs with invalid titles will be blocked until the title is corrected

### 4. Code Development Guidelines

#### a. Pre-commit Checks

Before submitting code, you must run pre-commit hooks to ensure code quality and consistency:

**Installation:**
```bash
pip install pre-commit
pre-commit install
```

**Running pre-commit:**
```bash
# Run on all files
pre-commit run --all-files

# Pre-commit will automatically run on git commit after installation
```

#### b. Import Statement Guidelines

AgentScope follows a **lazy import principle** to minimize resource loading:

- **DO**: Import modules only when they are actually used
  ```python
  def some_function():
      import openai
      # Use openai library here
  ```

This approach ensures that `import agentscope` remains lightweight and doesn't load unnecessary dependencies.

#### c. Unit Tests

- All new features must include appropriate unit tests
- Ensure existing tests pass before submitting your PR
- Run tests using:
  ```bash
  pytest tests
  ```

#### d. Documentation

- Update relevant documentation for new features
- Include code examples where appropriate
- Update the README.md if your changes affect user-facing functionality


## Types of Contributions

### Adding New Chat Models

AgentScope currently supports the following API providers at the chat model level: **OpenAI**, **DashScope**,
**Gemini**, **Anthropic**, and **Ollama**. These APIs are compatible with various service providers including vLLM,
DeepSeek, SGLang, and others.

**⚠️ Important Notice:**

Adding a new chat model is not merely a model-level task. It involves multiple components including:
- Message formatters
- Token counters
- Tools API integration

This is a substantial amount of work. To better focus our efforts on agent capability development and maintenance,
**the official development team currently does not plan to add support for new chat model APIs**. However, when there
is a strong need from the developer community, we will do our best to accommodate these requirements.

**If you wish to contribute a new chat model**, here are the components needed to be compatible with the
existing `ReActAgent` in the repository:

#### Required Components:

1. **Chat Model Class** (under `agentscope.model`):
   ```python
   from agentscope.model import ChatModelBase


   class YourChatModel(ChatModelBase):
       """
       The functionalities that you need to consider include:
       - Tools API integration
       - Both streaming and non-streaming modes (compatible with tools API)
       - tool_choice argument
       - reasoning models
       """
   ```

2. **Formatter Class** (under `agentscope.formatter`):
   ```python
   from agentscope.formatter import FormatterBase

   class YourModelFormatter(FormatterBase):
       """
       Convert `Msg` objects into the format required by your API provider.
       If your API doesn't support multi-agent scenarios (e.g. doesn't support the name field in messages), you need to
       implement two separate formatter classes for chatbot and multi-agent scenarios.
       """
   ```

3. **Token Counter** (under `agentscope.token`, recommended):
   ```python
   from agentscope.token import TokenCounterBase

   class YourTokenCounter(TokenCounterBase):
       """
       Implement token counting logic for your model.
       This is recommended but not strictly required.
       """
   ```

### Adding New Agents

To achieve true modularity, the `agentscope.agent` module currently aims to maintain only the **`ReActAgent`** class
as the core implementation. We ensure all functionalities in this class are **modular, detachable, and composable**.

In AgentScope, we follow an examples-first development workflow: prototype new implementations in the `examples/`
directory, then abstract and modularize the functionality, and finally integrate it into the core library.

For specialized or domain-specific agents, we recommend contributing them to the **`examples/agents`** directory:

```
examples/
└── agents/
    ├── main.py
    ├── README.md  # Explain the agent's purpose and usage
    └── ... # The other scripts
```

### Adding New Examples

We highly encourage contributions of new examples that showcase the capabilities of AgentScope! Your examples help others learn and get inspired.

**📝 About the Examples Directory:**

To maintain code quality and keep the repository accessible for everyone, we've designed the `examples/` directory in the main AgentScope repository to focus on **demonstrating AgentScope's functionalities**. Think of these as educational references and feature showcases that help developers quickly understand what AgentScope can do.

**What makes a great example here:**
- Clearly demonstrates specific AgentScope features or capabilities
- Easy to understand and follow along
- Serves as a learning material or reference implementation
- Focused and concise

**For More Complex Applications:**

Have you built something amazing with AgentScope? Perhaps a more sophisticated, production-ready application? That's fantastic! 🎉

We'd love to see your work in our **[agentscope-samples](https://github.com/agentscope-ai/agentscope-samples)** repository. This dedicated space is perfect for showcasing complete, real-world applications and sharing your AgentScope-based projects with the community. It's a great way to inspire others and demonstrate the full potential of the AgentScope ecosystem!

**Example Organization:**

Examples in the main repository are organized into subdirectories based on their type:

- `examples/agent/` for specialized agents
- `examples/functionality/` for showcasing specific functionalities of AgentScope
- `examples/game/` for game-related examples
- `examples/evaluation/` for evaluation scripts
- `examples/workflows/` for workflow demonstrations
- `examples/tuner/` for tuning-related examples

An example structure could be:

```
examples/
└── {example_type}/
    └── {example_name}/
        ├── main.py
        ├── README.md  # Explain the example's purpose and usage
        └── ... # The other scripts
```

### Adding New Memory Databases

The memory module in AgentScope currently supports:

- **In-memory storage**: For lightweight, temporary memory needs
- **Relational databases via SQLAlchemy**: For persistent, structured data storage
- **NoSQL databases**: For flexible schema requirements (e.g., Redis)

**⚠️ Important Notice:**

For **relational databases**, we use **SQLAlchemy** as a unified abstraction layer. SQLAlchemy already supports a wide
range of SQL databases including PostgreSQL, MySQL, SQLite, Oracle, Microsoft SQL Server, and many others.

**Therefore, we do not accept separate implementations for relational databases that are already supported by SQLAlchemy.**
If you need support for a specific relational database, please ensure it works through the existing SQLAlchemy integration.

**If you wish to contribute a new memory database implementation**, please consider:

1. **For relational databases**: Use the existing SQLAlchemy integration.

2. **For NoSQL databases**: If you're adding support for a new NoSQL database (e.g., MongoDB, Cassandra), please:
   - Implement a new memory class that extends the appropriate base class
   - Add comprehensive unit tests
   - Update documentation accordingly


## Do's and Don'ts

### ✅ DO:

- **Start small**: Begin with small, manageable contributions
- **Communicate early**: Discuss major changes before implementing them
- **Write tests**: Ensure your code is well-tested
- **Document your code**: Help others understand your contributions
- **Follow commit conventions**: Use conventional commit messages
- **Be respectful**: Follow our Code of Conduct
- **Ask questions**: If you're unsure about something, just ask!

### ❌ DON'T:

- **Don't surprise us with big pull requests**: Large, unexpected PRs are difficult to review and may not align with project goals. Always open an issue first to discuss major changes
- **Don't ignore CI failures**: Fix any issues flagged by continuous integration
- **Don't mix concerns**: Keep PRs focused on a single feature or fix
- **Don't forget to update tests**: Changes in functionality should be reflected in tests
- **Don't break existing APIs**: Maintain backward compatibility when possible, or clearly document breaking changes
- **Don't add unnecessary dependencies**: Keep the core library lightweight
- **Don't bypass the lazy import principle**: This keeps AgentScope fast to import

## Getting Help

If you need assistance or have questions:

- 💬 Open a [Discussion](https://github.com/agentscope-ai/agentscope/discussions)
- 🐛 Report bugs via [Issues](https://github.com/agentscope-ai/agentscope/issues)
- 📧 Contact the maintainers at DingTalk or Discord (links in the README.md)


---

Thank you for contributing to AgentScope! Your efforts help build a better tool for the entire community. 🚀



================================================
FILE: CONTRIBUTING_zh.md
================================================
# 贡献到 AgentScope

## 欢迎！🎉

感谢开源社区对 AgentScope 项目的关注和支持，作为一个开源项目，我们热烈欢迎并鼓励来自社区的贡献。无论是修复错误、添加新功能、改进文档还是
分享想法，这些贡献都能帮助 AgentScope 变得更好。

## 如何贡献

为了确保顺利协作并保持项目质量，请在贡献时遵循以下指南：

### 1. 检查现有计划和问题

在开始贡献之前，请查看我们的开发路线图：

- **查看 [Projects](https://github.com/orgs/agentscope-ai/projects/2) 页面** 和 **[带有 `roadmap` 标签的 Issues](https://github.com/agentscope-ai/agentscope/issues?q=is%3Aissue%20state%3Aopen%20label%3ARoadmap)** 以了解我们计划的开发任务。

  - **如果存在相关问题** 并且标记为未分配或开放状态：
    - 请在该问题下评论，表达您有兴趣参与该任务
    - 这有助于协调开发工作，避免重复工作

  - **如果不存在相关问题**：
    - 请创建一个新 issue 用以描述对应的更改或功能
    - 我们的团队将及时进行回复并提供反馈
    - 这有助于我们维护项目路线图并协调社区工作

### 2. 提交信息格式

AgentScope 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。这使得提交历史更易读，并能够自动生成更新日志。

**格式：**
```
<type>(<scope>): <subject>
```

**类型：**
- `feat:` 新功能
- `fix:` 错误修复
- `docs:` 仅文档更改
- `style:` 不影响代码含义的更改（空格、格式等）
- `refactor:` 既不修复错误也不添加功能的代码更改
- `perf:` 提高性能的代码更改
- `ci:` 添加缺失的测试或更正现有测试
- `chore:` 对构建过程或辅助工具和库的更改

**示例：**
```bash
feat(models): add support for Claude-3 model
fix(agent): resolve memory leak in ReActAgent
docs(readme): update installation instructions
refactor(formatter): simplify message formatting logic
ci(models): add unit tests for OpenAI integration
```

### 3. Pull Request 标题格式

Pull Request 标题必须遵循相同的 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

**格式：**
```
<type>(<scope>): <description>
```

**要求：**
- 标题必须以允许的类型之一开头：`feat`、`fix`、`docs`、`ci`、`refactor`、`test`、`chore`、`perf`、`style`、`build`、`revert`
- Scope 是可选的但建议添加
- **Scope 必须是小写** - 只允许小写字母、数字、连字符（`-`）和下划线（`_`）
- 描述应以小写字母开头
- 保持标题简洁且具有描述性

**示例：**
```
✅ 有效：
feat(memory): add redis cache support
fix(agent): resolve memory leak in ReActAgent
docs(tutorial): update installation guide
ci(workflow): add PR title validation
refactor(my-feature): simplify logic

❌ 无效：
feat(Memory): add cache          # Scope 必须是小写
feat(MEMORY): add cache          # Scope 必须是小写
feat(MyFeature): add feature     # Scope 必须是小写
```

**自动化验证：**
- 针对 `main` 分支的 PR 标题会通过 GitHub Actions 自动验证
- 标题无效的 PR 将被阻止，直到标题被修正

### 4. 代码开发指南

#### a. 提交前检查

在提交代码之前，请运行 pre-commit 钩子以确保代码质量和一致性：


```bash
pip install pre-commit
pre-commit install
```

**运行 pre-commit：**
```bash
# 在所有文件上运行
pre-commit run --all-files

# 安装后，pre-commit 将在 git commit 时自动运行
```

#### b. 关于代码中的 Import

AgentScope 遵循**懒加载导入原则**以最小化资源加载：

- **推荐做法**：仅在实际使用时导入模块
  ```python
  def some_function():
      import openai
      # 在此处使用 openai 库
  ```

这种方法确保 `import agentscope` 是一个轻量操作，不会加载不必要的依赖项。

#### c. 单元测试

- 所有新功能都必须包含适当的单元测试
- 在提交 PR 之前确保现有测试通过
- 使用以下命令运行测试：
  ```bash
  pytest tests
  ```

#### d. 文档

- 为新功能更新相关文档
- 在适当的地方包含代码示例
- 如果更改影响面向用户的功能，请更新 README.md


## 贡献类型

### 添加新的 ChatModel

AgentScope 目前内置支持以下 API 提供商：**OpenAI**、**DashScope**、**Gemini**、**Anthropic** 和 **Ollama**。
其中 `OpenAIChatModel` 的实现还兼容不同的服务提供商，如 vLLM，DeepSeek、SGLang 等。

**⚠️ 重要：**

添加新的 ChatModel 不仅涉及模型层面的实现，还涉及到其它组件的配合，具体包括：
- 消息格式化器（formatter）
- Token 计数器（token counter）
- Tools API 集成

这意味着添加一个 ChatModel 需要大量的工作来确保其与 AgentScope 生态系统的其他部分无缝集成。
为了更好地专注于智能体能力开发和维护，**官方开发团队目前不计划添加对新 API 的支持**。
但是当开发者社区有强烈需求时，我们将尽力满足这些需求。

**对于一个 ChatModel 类的实现**，为了与仓库中 `ReActAgent` 兼容，所需要实现的组件如下：

#### 必需组件：

1. **ChatModel**（位于 `agentscope.model` 下）：
   ```python
   from agentscope.model import ChatModelBase


   class YourChatModel(ChatModelBase):
       """
       需要考虑的功能包括：
       - 集成 tools API
       - 支持流式和非流式模式，并与 tools API 兼容
       - 支持 tool_choice 参数
       - 考虑支持推理模型
       """
   ```

2. **格式化器类**（位于 `agentscope.formatter` 下）：
   ```python
   from agentscope.formatter import FormatterBase

   class YourModelFormatter(FormatterBase):
       """
       将 `Msg` 对象转换为对应 API 提供商所需的格式。
       如果模型 API 不支持多智能体场景（例如不支持消息中的 name 字段），需要
       为 chatbot 和多智能体场景分别实现两个格式化器类。
       """
   ```

3. **Token 计数器**（位于 `agentscope.token` 下，推荐）：
   ```python
   from agentscope.token import TokenCounterBase

   class YourTokenCounter(TokenCounterBase):
       """
       为对应模型实现 token 计数逻辑（推荐实现，非严格要求）。
       """
   ```

### 添加新的智能体

为了确保 AgentScope 中所有的功能实现都是**模块化的、可拆卸的和可组合的**，`agentscope.agent` 模块目前仅维护 **`ReActAgent`** 类作为核心实现。

在 AgentScope 中，我们遵循示例优先的开发工作流程：

- 在 `examples/` 目录中初步实现新的功能
- 然后将重要功能抽象和模块化，集成到核心库中
- 修改 `examples/` 目录中的示例以使用新的核心功能

对于专门的或特定领域的智能体，我们建议按照以下组织形式将它们贡献到 **`examples/agent`** 目录：

```
examples/
└── agent/
    ├── main.py
    ├── README.md  # 解释智能体的目的和用法
    └── ... # 其他脚本
```

### 添加新的示例

欢迎开源社区贡献新的示例来展示 AgentScope 的各种功能！

**📝 关于示例目录：**

为了避免仓库变得过于臃肿，我们将 AgentScope 仓库中的 `examples/` 目录设计为专注于**展示 AgentScope 的功能性**。可以把这些示例看作是指导性的参考和功能展示，帮助开发者快速理解 AgentScope 能做什么。

**什么样的示例适合放在这里：**
- 清晰地展示 AgentScope 的特定功能或能力
- 易于理解和跟随学习
- 作为学习材料或参考实现
- 专注且简洁

**对于更复杂的应用：**

对于更加复杂，生产就绪的应用，我们非常期待在 **[agentscope-samples](https://github.com/agentscope-ai/agentscope-samples)** 仓库中看到您的作品。这个仓库专门用于展示、分享基于 AgentScope 生态搭建的完整的、真实世界的应用。

**示例组织方式：**

主仓库中的示例根据类型组织到子目录中：

- `examples/agent/` 用于专门的智能体
- `examples/functionality/` 用于展示 AgentScope 的特定功能
- `examples/game/` 用于游戏相关示例
- `examples/evaluation/` 用于评估脚本
- `examples/workflows/` 用于工作流演示
- `examples/tuner/` 用于微调相关示例

示例结构如下：

```
examples/
└── {example_type}/
    └── {example_name}/
        ├── main.py
        ├── README.md  # 解释示例的目的和用法
        └── ... # 其他脚本
```

### 添加新的记忆数据库

AgentScope 的记忆模块目前支持：

- **内存存储**：用于轻量级的临时记忆需求
- **通过 SQLAlchemy 支持关系型数据库**：用于持久化的结构化数据存储
- **NoSQL 数据库**：用于灵活的模式需求（例如 Redis）

**⚠️ 请注意：**

对于**关系型数据库**，我们使用 **SQLAlchemy** 作为统一的抽象层。SQLAlchemy 已经支持多种 SQL 数据库，包括 PostgreSQL、MySQL、SQLite、Oracle、Microsoft SQL Server 等。

**因此，为了保持 AgentScope 代码的整洁，目前不接受为 SQLAlchemy 已经支持的关系型数据库单独实现新的支持。**
如果您需要支持特定的关系型数据库，请确保通过现有的 SQLAlchemy 集成来实现。

**如果您希望贡献新的记忆数据库实现**，请考虑以下几点：

1. **对于关系型数据库**：使用现有的 SQLAlchemy 集成。

2. **对于 NoSQL 数据库**：如果您要添加对新 NoSQL 数据库的支持（例如 MongoDB、Cassandra），请：
   - 实现一个扩展适当基类的新记忆类
   - 添加全面的单元测试
   - 相应地更新文档


## Do's and Don'ts

### ✅ DO

- **从小处着手**：从小的、可管理的贡献开始
- **及早沟通**：在实现主要功能之前进行讨论
- **编写测试**：确保代码经过充分测试
- **添加代码注释**：帮助他人理解贡献内容
- **遵循提交约定**：使用约定式提交消息
- **保持尊重**：遵守我们的行为准则
- **提出问题**：如果不确定某事，请提问！

### ❌ DON'T

- **不要用大型 PR 让我们措手不及**：大型的、意外的 PR 难以审查，并且可能与项目目标不一致。在进行重大更改之前，请务必先开启一个问题进行讨论
- **不要忽略 CI 失败**：修复持续集成标记的任何问题
- **不要混合关注点**：保持 PR 专注于单一功能的实现或修复
- **不要忘记更新测试**：功能的更改应反映在测试中
- **不要破坏现有 API**：在可能的情况下保持向后兼容性，或清楚地记录破坏性更改
- **不要添加不必要的依赖项**：保持核心库轻量级
- **不要绕过懒加载导入原则**：确保 AgentScope 在导入阶段不至于臃肿

## 获取帮助

如果需要帮助或有疑问：

- 💬 开启一个 [Discussion](https://github.com/agentscope-ai/agentscope/discussions)
- 🐛 通过 [Issues](https://github.com/agentscope-ai/agentscope/issues) 报告错误
- 📧 通过钉钉交流群或 Discord 联系开发团队（链接在 README.md 中）


---

感谢为 AgentScope 做出贡献！🚀




================================================
FILE: LICENSE
================================================

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright 2024 Alibaba

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.



--------------------------------------------------------------------------------


Some codes of tests/run.py is modified from
https://github.com/alibaba/FederatedScope/blob/master/tests/run.py, which is
also licensed under the terms of the Apache 2.0.


--------------------------------------------------------------------------------

Code in src/agentscope/web/static/js/socket.io.js is adapted from
https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.1.3/socket.io.js (MIT License)

Copyright (c) 2014-2021 Guillermo Rauch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

--------------------------------------------------------------------------------

Code in src/agentscope/web/static/js/jquery-3.3.1.min.js is adapted from
https://code.jquery.com/jquery-3.3.1.min.js (MIT License)

Copyright (c) JS Foundation and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

--------------------------------------------------------------------------------

Code in src/agentscope/web/static/js/bootstrap.bundle.min.js is adapted from
https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.bundle.min.js
 (MIT License)

Copyright (c) 2011-2019 The Bootstrap Authors (https://github
.com/twbs/bootstrap/graphs/contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

--------------------------------------------------------------------------------

Code in src/agentscope/web/static/js/bootstrap-table.min.js is adapted from
https://unpkg.com/bootstrap-table@1.18.0/dist/bootstrap-table.min.js (MIT
License)

Copyright (c) wenzhixin <wenzhixin2010@gmail.com> (http://wenzhixin.net.cn/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

--------------------------------------------------------------------------------

Code in src/agentscope/web/static/css/bootstrap.min.css is adapted from
https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css (MIT
License)

Copyright 2011-2019 The Bootstrap Authors
Copyright 2011-2019 Twitter, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


--------------------------------------------------------------------------------

Fonts in src/agentscope/web/static/fonts/KRYPTON.ttf is adapted from
https://github.com/githubnext/monaspace (SIL Open Font License 1.1). These
fonts are distributed with their original license. See https://github
.com/githubnext/monaspace/blob/main/LICENSE for the full text of the license.
The following font families are included:

- Monaspace (with subfamilies: Krypton)

Copyright (c) 2023, GitHub https://github.com/githubnext/monaspace
with Reserved Font Name "Monaspace", including subfamilies: "Argon", "Neon",
"Xenon", "Radon", and "Krypton"

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.

--------------------------------------------------------------------------------

Fonts in src/agentscope/web/static/fonts/OSWALD.ttf is adapted from
https://fonts.google.com/specimen/Oswald (SIL Open Font License 1.1). These
fonts are distributed with their original license. See https://github
.com/googlefonts/OswaldFont/blob/main/OFL.txt for the full text of the license.

Copyright 2016 The Oswald Project Authors (https://github
.com/googlefonts/OswaldFont)

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.

--------------------------------------------------------------------------------


================================================
FILE: pyproject.toml
================================================

[project]
name = "agentscope"
dynamic = ["version"]
description = "AgentScope: A Flexible yet Robust Multi-Agent Platform."
readme = "README.md"
authors = [
    { name = "SysML team of Alibaba Tongyi Lab", email = "gaodawei.gdw@alibaba-inc.com" }
]
license = "Apache-2.0"
keywords = ["deep-learning", "multi agents", "agents"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.10",
    "Operating System :: OS Independent",
    "Intended Audience :: Developers",
    "Intended Audience :: Science/Research",
    "Topic :: Scientific/Engineering :: Artificial Intelligence",
]
requires-python = ">=3.10"
dependencies = [
    "aioitertools",
    "anthropic",
    "dashscope",
    "docstring_parser",
    "json5",
    "json_repair",
    "mcp>=1.13",
    "numpy",
    "openai",
    "python-datauri",
    "opentelemetry-api>=1.39.0",
    "opentelemetry-sdk>=1.39.0",
    "opentelemetry-exporter-otlp>=1.39.0",
    "opentelemetry-semantic-conventions>=0.60b0",
    "python-socketio",
    "shortuuid",
    "tiktoken",
    "sounddevice",
    "sqlalchemy",
    "python-frontmatter",
]

[project.optional-dependencies]
# ------------ A2A protocol ------------
a2a = [
    "a2a-sdk",
    "httpx",
    # TODO: split the card resolvers from the a2a dependency
    "nacos-sdk-python>=3.0.0",
]

# ------------ Realtime -------------
realtime = ["websockets>=14.0", "scipy"]

# ------------ Model APIs ------------
gemini = ["google-genai"]
ollama = ["ollama>=0.5.4"]
models = [
    "agentscope[ollama]",
    "agentscope[gemini]",
]

# ------------ Tokenizers ------------
tokens = [
    "Pillow",
    "transformers",
    "jinja2",
]

# ------------ Memory ------------
redis_memory = ["redis"]

mem0ai = [
    "mem0ai<=1.0.3",
    "packaging"
]
reme = ["reme-ai>=0.2.0.3"]
memory = [
    "agentscope[redis_memory]",
    "agentscope[mem0ai]",
    "agentscope[reme]",
]

# ------------ RAG ------------
# readers
text-reader = ["nltk"]
pdf-reader = [
    "agentscope[text-reader]",
    # TODO: the latest pypdf has some issues with parsing PDFs
    #  (2026-01-13), so we fix the version here temporarily.
    "pypdf<=6.5.0",
]
docx-reader = [
    "agentscope[text-reader]",
    "python-docx"
]
excel-reader = [
    "agentscope[text-reader]",
    "pandas",
    "openpyxl",
]
ppt-reader = [
    "agentscope[text-reader]",
    "python-pptx"
]
readers = [
    "agentscope[text-reader]",
    "agentscope[pdf-reader]",
    "agentscope[docx-reader]",
    "agentscope[excel-reader]",
    "agentscope[ppt-reader]",
]

# vdb
# The qdrant-client >= 1.16.0 has conflicts with pymilvus, so we fix
# the version to 1.15.1 here.
qdrant = ["qdrant-client==1.15.1"]
milvus = ["pymilvus[milvus_lite]"]
ali_mysql = ["mysql-connector-python"]
mongodb = ["pymongo"]
oceanbase = ["pyobvector>=0.2.0,<0.3.0"]
vdbs = [
    "agentscope[ali_mysql]",
    "agentscope[qdrant]",
    "agentscope[milvus]",
    "agentscope[mongodb]",
    "agentscope[oceanbase]",
]

rag = [
    "agentscope[readers]",
    "agentscope[vdbs]",
]

# ------------ Evaluation ------------
evaluate = ["ray"]

# ------------ Full ------------
full = [
    "agentscope[a2a]",
    "agentscope[models]",
    "agentscope[tokens]",
    "agentscope[memory]",
    "agentscope[rag]",
    "agentscope[evaluate]",
    "agentscope[realtime]",
]

# ------------ Development ------------
dev = [
    # Include full dependencies from local package
    "agentscope[full]",
    # Development tools
    "pre-commit",
    "pytest",
    "pytest-forked",
    "sphinx-gallery",
    "furo",
    "myst_parser",
    "matplotlib",
    # For unittests
    # For mocking redis in unittests
    "fakeredis",
    "aiosqlite",
    "greenlet",
    # For openjudge
    "py-openjudge",
]

[project.urls]
Homepage = "https://github.com/agentscope-ai/agentscope"
Documentation = "https://doc.agentscope.io/"
Repository = "https://github.com/agentscope-ai/agentscope"

[tool.setuptools]
packages = { find = { where = ["src"] } }
include-package-data = true

[tool.setuptools.package-data]
"*" = ["py.typed"]

[build-system]
requires = ["setuptools>=45", "wheel"]
build-backend = "setuptools.build_meta"

[tool.setuptools.dynamic]
version = {attr = "agentscope._version.__version__"}



================================================
FILE: README_zh.md
================================================
<p align="center">
  <img
    src="https://img.alicdn.com/imgextra/i1/O1CN01nTg6w21NqT5qFKH1u_!!6000000001621-55-tps-550-550.svg"
    alt="AgentScope Logo"
    width="200"
  />
</p>

<span align="center">

[**English Homepage**](https://github.com/agentscope-ai/agentscope/blob/main/README.md) | [**Tutorial**](https://doc.agentscope.io/zh_CN/) | [**Roadmap (Jan 2026 -)**](https://github.com/agentscope-ai/agentscope/blob/main/docs/roadmap.md) | [**FAQ**](https://doc.agentscope.io/zh_CN/tutorial/faq.html)

</span>

<p align="center">
    <a href="https://arxiv.org/abs/2402.14034">
        <img
            src="https://img.shields.io/badge/cs.MA-2402.14034-B31C1C?logo=arxiv&logoColor=B31C1C"
            alt="arxiv"
        />
    </a>
    <a href="https://pypi.org/project/agentscope/">
        <img
            src="https://img.shields.io/badge/python-3.10+-blue?logo=python"
            alt="pypi"
        />
    </a>
    <a href="https://pypi.org/project/agentscope/">
        <img
            src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fpypi.org%2Fpypi%2Fagentscope%2Fjson&query=%24.info.version&prefix=v&logo=pypi&label=version"
            alt="pypi"
        />
    </a>
    <a href="https://discord.gg/eYMpfnkG8h">
        <img
            src="https://img.shields.io/discord/1194846673529213039?label=Discord&logo=discord"
            alt="discord"
        />
    </a>
    <a href="https://doc.agentscope.io/">
        <img
            src="https://img.shields.io/badge/Docs-English%7C%E4%B8%AD%E6%96%87-blue?logo=markdown"
            alt="docs"
        />
    </a>
    <a href="./LICENSE">
        <img
            src="https://img.shields.io/badge/license-Apache--2.0-black"
            alt="license"
        />
    </a>
</p>

<p align="center">
<img src="https://trendshift.io/api/badge/repositories/10079" alt="modelscope%2Fagentscope | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/>
</p>

## What is AgentScope？

AgentScope 是一款企业级开箱即用的智能体框架，提供灵活的核心抽象以适配不断进化的模型能力，并原生支持模型微调。

我们为新一代自主智能的大语言模型而生。 我们的理念是释放模型的推理与工具调用潜能，而不是用僵化的提示工程和预设流程束缚它们的手脚。

## Why use AgentScope？

- **简单**: 使用内置的 ReAct 智能体、工具、技能、人机协作、记忆、计划、实时语音、评估和模型微调轻松构建智能体应用
- **可扩展**: 大量生态系统集成，包括工具、记忆和可观察性；内置 MCP 和 A2A 支持；消息中心（MsgHub）提供灵活的多智能体编排能力
- **生产就绪**: 在本地、云端 Serverless 或 K8s 集群上轻松部署智能体应用，并内置 OTel 可观察性支持


<p align="center">
<img src="./assets/images/agentscope_20260120.png" width="90%" alt="AgentScope 生态系统" />
<br/>
AgentScope 生态
</p>


## 📢 新闻
<!-- BEGIN NEWS -->
- **[2026-02] `功能`:** 支持实时语音交互。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent) | [多智能体实时交互](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime) | [文档](https://doc.agentscope.io/tutorial/task_realtime.html)
- **[2026-01] `社区`:** AgentScope 双周会议启动，分享生态更新和开发计划 - 欢迎加入！[详情与安排](https://github.com/agentscope-ai/agentscope/discussions/1126)
- **[2026-01] `功能`:** 记忆模块新增数据库支持和记忆压缩。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/short_term_memory/memory_compression) | [教程](https://doc.agentscope.io/tutorial/task_memory.html)
- **[2025-12] `集成`:** A2A（智能体间通信）协议支持。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/a2a_agent) | [教程](https://doc.agentscope.io/zh_CN/tutorial/task_a2a.html)
- **[2025-12] `功能`:** TTS（文本转语音）支持。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/tts) | [教程](https://doc.agentscope.io/zh_CN/tutorial/task_tts.html)
- **[2025-11] `集成`:** Anthropic Agent Skill 支持。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/agent_skill) | [教程](https://doc.agentscope.io/zh_CN/tutorial/task_agent_skill.html)
- **[2025-11] `发布`:** 面向多样化真实任务的 Alias-Agent 和数据处理的 Data-Juicer Agent 开源。[Alias-Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/alias) | [Data-Juicer Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/data_juicer_agent)
- **[2025-11] `集成`:** 通过 Trinity-RFT 库实现智能体强化学习。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/tuner/react_agent) | [Trinity-RFT](https://github.com/agentscope-ai/Trinity-RFT)
- **[2025-11] `集成`:** ReMe 增强长期记忆。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/long_term_memory/reme)
- **[2025-11] `发布`:** agentscope-samples 样例库上线，agentscope-runtime 升级支持 Docker/K8s 部署和 VNC 图形沙盒。[样例库](https://github.com/agentscope-ai/agentscope-samples) | [Runtime](https://github.com/agentscope-ai/agentscope-runtime)
<!-- END NEWS -->

[更多新闻 →](./docs/NEWS_zh.md)

## 联系我们

欢迎加入我们的社区！

| [Discord](https://discord.gg/eYMpfnkG8h)                                                                                         | 钉钉                                                                        |
|----------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| <img src="https://gw.alicdn.com/imgextra/i1/O1CN01hhD1mu1Dd3BWVUvxN_!!6000000000238-2-tps-400-400.png" width="100" height="100"> | <img src="./assets/images/dingtalk_qr_code.png" width="100" height="100"> |

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## 📑 Table of Contents

- [快速开始](#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
  - [安装](#%E5%AE%89%E8%A3%85)
    - [从 PyPI 安装](#%E4%BB%8E-pypi-%E5%AE%89%E8%A3%85)
    - [从源码安装](#%E4%BB%8E%E6%BA%90%E7%A0%81%E5%AE%89%E8%A3%85)
- [样例](#%E6%A0%B7%E4%BE%8B)
  - [Hello AgentScope！](#hello-agentscope)
  - [语音智能体](#%E8%AF%AD%E9%9F%B3%E6%99%BA%E8%83%BD%E4%BD%93)
  - [实时语音智能体](#%E5%AE%9E%E6%97%B6%E8%AF%AD%E9%9F%B3%E6%99%BA%E8%83%BD%E4%BD%93)
  - [人机协作](#%E4%BA%BA%E6%9C%BA%E5%8D%8F%E4%BD%9C)
  - [灵活的 MCP 控制](#%E7%81%B5%E6%B4%BB%E7%9A%84-mcp-%E6%8E%A7%E5%88%B6)
  - [智能体强化学习](#%E6%99%BA%E8%83%BD%E4%BD%93%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0)
  - [多智能体工作流](#%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93%E5%B7%A5%E4%BD%9C%E6%B5%81)
- [文档](#%E6%96%87%E6%A1%A3)
- [更多样例](#%E6%9B%B4%E5%A4%9A%E6%A0%B7%E4%BE%8B)
  - [功能](#%E5%8A%9F%E8%83%BD)
  - [智能体](#%E6%99%BA%E8%83%BD%E4%BD%93)
  - [游戏](#%E6%B8%B8%E6%88%8F)
  - [工作流](#%E5%B7%A5%E4%BD%9C%E6%B5%81)
  - [评估](#%E8%AF%84%E4%BC%B0)
  - [微调](#%E5%BE%AE%E8%B0%83)
- [贡献](#%E8%B4%A1%E7%8C%AE)
- [许可](#%E8%AE%B8%E5%8F%AF)
- [论文](#%E8%AE%BA%E6%96%87)
- [贡献者](#%E8%B4%A1%E7%8C%AE%E8%80%85)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 快速开始

### 安装

> AgentScope 需要 **Python 3.10** 或更高版本。

#### 从 PyPI 安装

```bash
pip install agentscope
```

或使用 uv：

```bash
uv pip install agentscope
```

#### 从源码安装

```bash
# 从 GitHub 拉取源码
git clone -b main https://github.com/agentscope-ai/agentscope.git

# 以可编辑模式安装包
cd agentscope

pip install -e .
# 或使用 uv：
# uv pip install -e .
```

## 样例

### Hello AgentScope！

开始与名为"Friday"的 ReAct 智能体 🤖 进行对话！

```python
from agentscope.agent import ReActAgent, UserAgent
from agentscope.model import DashScopeChatModel
from agentscope.formatter import DashScopeChatFormatter
from agentscope.memory import InMemoryMemory
from agentscope.tool import Toolkit, execute_python_code, execute_shell_command
import os, asyncio


async def main():
    toolkit = Toolkit()
    toolkit.register_tool_function(execute_python_code)
    toolkit.register_tool_function(execute_shell_command)

    agent = ReActAgent(
        name="Friday",
        sys_prompt="You're a helpful assistant named Friday.",
        model=DashScopeChatModel(
            model_name="qwen-max",
            api_key=os.environ["DASHSCOPE_API_KEY"],
            stream=True,
        ),
        memory=InMemoryMemory(),
        formatter=DashScopeChatFormatter(),
        toolkit=toolkit,
    )

    user = UserAgent(name="user")

    msg = None
    while True:
        msg = await agent(msg)
        msg = await user(msg)
        if msg.get_text_content() == "exit":
            break

asyncio.run(main())
```

### 语音智能体

创建支持语音的 ReAct 智能体，能够理解语音并进行语音回复，还可以使用语音交互玩多智能体狼人杀游戏。

https://github.com/user-attachments/assets/559af387-fd6f-4f0c-b882-cd4778214801


### 实时语音智能体

使用 AgentScope 轻松构建实时交互的智能体应用，提供统一的事件接口和工具调用支持。

[实时语音智能体](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent) | [多智能体实时交互](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime)

https://github.com/user-attachments/assets/d9674ad5-f71d-43d5-a341-5bada318aee0



### 人机协作

在 ReActAgent 中支持实时打断：可以通过取消操作实时中断对话，并通过强大的记忆保留机制无缝恢复。

<img src="./assets/images/realtime_steering_zh.gif" alt="Realtime Steering" width="60%"/>

### 灵活的 MCP 控制

AgentScope 支持将单个 MCP 工具作为**本地可调用函数**使用，装备给智能体或封装为更复杂的工具。

```python
from agentscope.mcp import HttpStatelessClient
from agentscope.tool import Toolkit
import os

async def fine_grained_mcp_control():
    # 以高德MCP为例，初始化MCP客户端
    client = HttpStatelessClient(
        name="gaode_mcp",
        transport="streamable_http",
        url=f"https://mcp.amap.com/mcp?key={os.environ['GAODE_API_KEY']}",
    )

    # 将 MCP 工具获取为**本地可调用函数**，并在任何地方使用
    func = await client.get_callable_function(func_name="maps_geo")

    # 选项 1：直接调用
    await func(address="天安门广场", city="北京")

    # 选项 2：作为工具传递给智能体
    toolkit = Toolkit()
    toolkit.register_tool_function(func)
    # ...

    # 选项 3：包装为更复杂的工具
    # ...
```

### 智能体强化学习

通过强化学习集成无缝训练智能体应用。我们还准备了涵盖各种场景的样例项目：

| 样例                                                                                               | 描述                         | 模型                     | 训练结果                        |
|--------------------------------------------------------------------------------------------------|----------------------------|------------------------|-----------------------------|
| [Math Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/math_agent)     | 通过多步推理调优数学求解智能体。           | Qwen3-0.6B             | Accuracy: 75% → 85%         |
| [Frozen Lake](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/frozen_lake)   | 训练智能体进行冰湖游戏。               | Qwen2.5-3B-Instruct    | Success rate: 15% → 86%     |
| [Learn to Ask](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/learn_to_ask) | 使用 LLM 作为评判获得自动反馈，从而调优智能体。 | Qwen2.5-7B-Instruct    | Accuracy: 47% → 92%         |
| [Email Search](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/email_search) | 在训练数据没有标注真值的情况下提升工具使用能力。   | Qwen3-4B-Instruct-2507 | Accuracy: 60%               |
| [Werewolf Game](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/werewolves)  | 训练智能体进行战略性多智能体游戏互动。        | Qwen2.5-7B-Instruct    | 狼人胜率：50% → 80%              |
| [Data Augment](https://github.com/agentscope-ai/agentscope-samples/tree/main/tuner/data_augment) | 生成合成训练数据以增强调优结果。           | Qwen3-0.6B             | AIME-24 accuracy: 20% → 60% |

### 多智能体工作流

AgentScope 提供 ``MsgHub`` 和 pipeline 来简化多智能体对话，提供高效的消息路由和无缝信息共享

```python
from agentscope.pipeline import MsgHub, sequential_pipeline
from agentscope.message import Msg
import asyncio

async def multi_agent_conversation():
    # 创建智能体
    agent1 = ...
    agent2 = ...
    agent3 = ...
    agent4 = ...

    # 创建消息中心来管理多智能体对话
    async with MsgHub(
        participants=[agent1, agent2, agent3],
        announcement=Msg("Host", "请介绍一下自己。", "assistant")
    ) as hub:
        # 按顺序发言
        await sequential_pipeline([agent1, agent2, agent3])
        # 动态管理参与者
        hub.add(agent4)
        hub.delete(agent3)
        await hub.broadcast(Msg("Host", "再见！", "assistant"))

asyncio.run(multi_agent_conversation())
```


## 文档

- [教程](https://doc.agentscope.io/zh_CN/tutorial/)
- [常见问题](https://doc.agentscope.io/zh_CN/tutorial/faq.html)
- [API 文档](https://doc.agentscope.io/zh_CN/api/agentscope.html)

## 更多样例

### 功能

- [MCP](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/mcp)
- [Anthropic 智能体技能](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/agent_skill)
- [计划](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/plan)
- [结构化输出](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/structured_output)
- [RAG](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/rag)
- [长期记忆](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/long_term_memory)
- [基于 SQLite 的会话管理](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/session_with_sqlite)
- [流式打印消息](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/stream_printing_messages)
- [TTS](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/tts)
- [高代码部署](https://github.com/agentscope-ai/agentscope/tree/main/examples/deployment/planning_agent)
- [记忆压缩](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/short_term_memory/memory_compression)

### 智能体

- [ReAct 智能体](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/react_agent)
- [语音智能体](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/voice_agent)
- [Deep Research 智能体](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/deep_research_agent)
- [Browser-use 智能体](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/browser_agent)
- [Meta Planner 智能体](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/meta_planner_agent)
- [A2A 智能体](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/a2a_agent)
- [实时语音交互智能体](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent)

### 游戏

- [九人制狼人杀](https://github.com/agentscope-ai/agentscope/tree/main/examples/game/werewolves)

### 工作流

- [多智能体辩论](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_debate)
- [多智能体对话](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_conversation)
- [多智能体并发](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_concurrent)
- [多智能体实时语音交互](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime)

### 评估

- [ACEBench](https://github.com/agentscope-ai/agentscope/tree/main/examples/evaluation/ace_bench)

### 微调

- [调优 ReAct 智能体](https://github.com/agentscope-ai/agentscope/tree/main/examples/tuner/react_agent)


## 贡献

我们欢迎社区的贡献！请参阅我们的 [贡献指南](./CONTRIBUTING_zh.md) 了解如何贡献到 AgentScope。

## 许可

AgentScope 基于 Apache License 2.0 发布。

## 论文

如果我们的工作对您的研究或应用有帮助，请引用我们的论文。

- [AgentScope 1.0: A Developer-Centric Framework for Building Agentic Applications](https://arxiv.org/abs/2508.16279)

- [AgentScope: A Flexible yet Robust Multi-Agent Platform](https://arxiv.org/abs/2402.14034)

```
@article{agentscope_v1,
    author  = {Dawei Gao, Zitao Li, Yuexiang Xie, Weirui Kuang, Liuyi Yao, Bingchen Qian, Zhijian Ma, Yue Cui, Haohao Luo, Shen Li, Lu Yi, Yi Yu, Shiqi He, Zhiling Luo, Wenmeng Zhou, Zhicheng Zhang, Xuguang He, Ziqian Chen, Weikai Liao, Farruh Isakulovich Kushnazarov, Yaliang Li, Bolin Ding, Jingren Zhou},
    title   = {AgentScope 1.0: A Developer-Centric Framework for Building Agentic Applications},
    journal = {CoRR},
    volume  = {abs/2508.16279},
    year    = {2025},
}

@article{agentscope,
    author  = {Dawei Gao, Zitao Li, Xuchen Pan, Weirui Kuang, Zhijian Ma, Bingchen Qian, Fei Wei, Wenhao Zhang, Yuexiang Xie, Daoyuan Chen, Liuyi Yao, Hongyi Peng, Zeyu Zhang, Lin Zhu, Chen Cheng, Hongzhu Shi, Yaliang Li, Bolin Ding, Jingren Zhou},
    title   = {AgentScope: A Flexible yet Robust Multi-Agent Platform},
    journal = {CoRR},
    volume  = {abs/2402.14034},
    year    = {2024},
}
```

## 贡献者

感谢所有贡献者：

<a href="https://github.com/agentscope-ai/agentscope/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=agentscope-ai/agentscope&max=999&columns=12&anon=1" alt="贡献者" />
</a>



================================================
FILE: .pre-commit-config.yaml
================================================
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.3.0
    hooks:
      - id: check-ast
      - id: sort-simple-yaml
      - id: check-yaml
        exclude: |
          (?x)^(
              meta.yaml
          )$
      - id: check-xml
      - id: check-toml
      - id: check-docstring-first
      - id: check-json
      - id: fix-encoding-pragma
      - id: detect-private-key
      - id: trailing-whitespace
  - repo: https://github.com/asottile/add-trailing-comma
    rev: v3.1.0
    hooks:
      - id: add-trailing-comma
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.7.0
    hooks:
      - id: mypy
        exclude:
            (?x)(
                pb2\.py$
                | grpc\.py$
                | ^docs
                | \.html$
            )
        args: [ --disallow-untyped-defs,
                --disallow-incomplete-defs,
                --ignore-missing-imports,
                --disable-error-code=var-annotated,
                --disable-error-code=union-attr,
                --disable-error-code=assignment,
                --disable-error-code=attr-defined,
                --disable-error-code=import-untyped,
                --disable-error-code=truthy-function,
                --disable-error-code=typeddict-item,
                --follow-imports=skip,
                --explicit-package-bases,
                ]
  # - repo: https://github.com/numpy/numpydoc
  #   rev: v1.6.0
  #   hooks:
  #     - id: numpydoc-validation
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
    - id: black
      args: [--line-length=79]
  - repo: https://github.com/PyCQA/flake8
    rev: 6.1.0
    hooks:
      - id: flake8
        args: ["--extend-ignore=E203"]
        exclude: ^docs
  - repo: https://github.com/pylint-dev/pylint
    rev: v3.0.2
    hooks:
      - id: pylint
        exclude:
            (?x)(
                ^docs
                | pb2\.py$
                | grpc\.py$
                | \.demo$
                | \.md$
                | \.html$
                | ^examples/paper_llm_based_algorithm/
          )
        args: [
          --disable=W0511,
          --disable=W0718,
          --disable=W0122,
          --disable=C0103,
          --disable=R0913,
          --disable=E0401,
          --disable=E1101,
          --disable=C0415,
          --disable=W0603,
          --disable=R1705,
          --disable=R0914,
          --disable=E0601,
          --disable=W0602,
          --disable=W0604,
          --disable=R0801,
          --disable=R0902,
          --disable=R0903,
          --disable=C0123,
          --disable=W0231,
          --disable=W1113,
          --disable=W0221,
          --disable=R0401,
          --disable=W0632,
          --disable=W0123,
          --disable=C3001,
        ]
  - repo: https://github.com/regebro/pyroma
    rev: "5.0"
    hooks:
      - id: pyroma
        args: [--min=10, .]



================================================
FILE: docs/changelog.md
================================================
# CHANGELOG of v1.0.0

> ➡️ change; ✅ new feature; ❌ deprecate

The overall changes from v0.x.x to v1.0.0 are summarized below.

## Overview
- ✅ Support asynchronous execution throughout the library
- ✅ Support tools API thoroughly


## ✨Session
- ✅ Support automatic state management
- ✅ Support session/application-level state management


## ✨Tracing
- ✅ Support OpenTelemetry-based tracing
- ✅ Support third-party tracing platforms, e.g. Arize-Phoenix, Langfuse, etc.


## ✨MCP
- ✅ Support both client- and function-level control over MCP by a new MCP module
- ✅ Support both "pay-as-you-go" and persistent session management
- ✅ Support streamable HTTP, SSE and StdIO transport protocols


## ✨Memory
- ✅ Support long-term memory by providing a `LongTermMemoryBase` class
- ✅ Provide a Mem0-based long-term memory implementation
- ✅ Support both static- and agent-controlled long-term memory modes


## Formatter
- ✅ Support prompt construction/formatting with token count estimation
- ✅ Support tools API in multi-agent prompt formatting


## Model
- ❌ Deprecate model configuration, use explicit object instantiation instead
- ✅ Provide a new `ModelResponse` class for structured model responses
- ✅ Support asynchronous model invocation
- ✅ Support reasoning models
- ✅ Support any combination of streaming/non-streaming, reasoning/non-reasoning and tools API


## Agent
- ❌ Deprecate `DialogAgent`, `DictDialogAgent` and prompt-based ReAct agent class
- ➡️ Expose memory, formatter interfaces to the agent's constructor in ReActAgent
- ➡️ Unify the signature of pre- and post- agent hooks
- ✅ Support pre-/post-reasoning and pre-/post-acting hooks in ReActAgent class
- ✅ Support asynchronous agent execution
- ✅ Support interrupting agent's replying and customized interruption handling
- ✅ Support automatic state management
- ✅ Support parallel tool calls
- ✅ Support two-modes long-term memory in ReActAgent class


## Tool
- ✅ Provide a more powerful `Toolkit` class for tools management
- ✅ Provide a new `ToolResponse` class for structured and multimodal tool responses
- ✅ Support group-wise tool management
- ✅ Support agent to manage tools by itself
- ✅ Support post-processing of tool responses
- Tool function
  - ✅ Support both async and sync functions
  - ✅ Support both streaming and non-streaming return


## Evaluation
- ✅ Support ReAct agent-oriented evaluation
- ✅ Support Ray-based distributed and concurrent evaluation
- ✅ Support statistical analysis over evaluation results


## AgentScope Studio
- ✅ Support runtime tracing
- ✅ Provide a built-in copilot agent named Friday


## Logging
- ❌ Deprecate `loguru` and use Python native `logging` module instead


## Distribution
- ❌ Deprecate distribution functionality momentarily, a new distribution module is coming soon


## RAG
- ❌ Deprecate RAG functionality momentarily, a new RAG module is coming soon


## Parsers
- ❌ Deprecate parsers module


## WebBrowser
- ❌ Deprecate the `WebBrowser` class and shift to MCP-based web browsing



================================================
FILE: docs/NEWS.md
================================================
<!-- This is the source of truth for all NEWS items. -->
<!-- The first 10 items are automatically synced to README.md and README_zh.md via GitHub Actions. -->
<!-- To update news in READMEs, modify this file and push to trigger the workflow. -->

- **[2026-02] `FEAT`:** Realtime Voice Agent support. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent) | [Multi-Agent Realtime Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime) | [Tutorial](https://doc.agentscope.io/tutorial/task_realtime.html)
- **[2026-01] `COMM`:** Biweekly Meetings launched to share ecosystem updates and development plans - join us! [Details & Schedule](https://github.com/agentscope-ai/agentscope/discussions/1126)
- **[2026-01] `FEAT`:** Database support & memory compression in memory module. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/short_term_memory/memory_compression) | [Tutorial](https://doc.agentscope.io/tutorial/task_memory.html)
- **[2025-12] `INTG`:** A2A (Agent-to-Agent) protocol support. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/a2a_agent) | [Tutorial](https://doc.agentscope.io/tutorial/task_a2a.html)
- **[2025-12] `FEAT`:** TTS (Text-to-Speech) support. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/tts) | [Tutorial](https://doc.agentscope.io/tutorial/task_tts.html)
- **[2025-11] `INTG`:** Anthropic Agent Skill support. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/agent_skill) | [Tutorial](https://doc.agentscope.io/tutorial/task_agent_skill.html)
- **[2025-11] `RELS`:** Alias-Agent for diverse real-world tasks and Data-Juicer Agent for data processing open-sourced. [Alias-Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/alias) | [Data-Juicer Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/data_juicer_agent)
- **[2025-11] `INTG`:** Agentic RL via Trinity-RFT library. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/tuner/react_agent) | [Trinity-RFT](https://github.com/agentscope-ai/Trinity-RFT)
- **[2025-11] `INTG`:** ReMe for enhanced long-term memory. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/long_term_memory/reme)
- **[2025-11] `RELS`:** agentscope-samples repository launched and agentscope-runtime upgraded with Docker/K8s deployment and VNC-powered GUI sandboxes. [Samples](https://github.com/agentscope-ai/agentscope-samples) | [Runtime](https://github.com/agentscope-ai/agentscope-runtime)
- **[2025-11] `DOCS`:** Contributing Guide is online - welcome to contribute! [Guide](./CONTRIBUTING.md)
- **[2025-09] `FEAT`:** RAG module released. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/rag) | [Tutorial](https://doc.agentscope.io/tutorial/task_rag.html)
- **[2025-09] `FEAT`:** Voice agent support - ReActAgent now supports Qwen-Omni and GPT-Audio natively. [Example](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/voice_agent) | [Roadmap](https://github.com/agentscope-ai/agentscope/issues/773)
- **[2025-09] `FEAT`:** Plan module released. [Tutorial](https://doc.agentscope.io/tutorial/task_plan.html)
- **[2025-09] `RELS`:** AgentScope Runtime open-sourced - enabling effective agent deployment with sandboxed tool execution. [GitHub](https://github.com/agentscope-ai/agentscope-runtime)
- **[2025-09] `RELS`:** AgentScope Studio open-sourced. [GitHub](https://github.com/agentscope-ai/agentscope-studio)
- **[2025-08] `DOCS`:** Tutorial v1 is online. [Tutorial](https://doc.agentscope.io)
- **[2025-08] `RELS`:** AgentScope v1 released - fully embracing asynchronous execution with many new features and improvements. [Changelog](https://github.com/agentscope-ai/agentscope/blob/main/docs/changelog.md)




================================================
FILE: docs/NEWS_zh.md
================================================
<!-- This is the source of truth for all NEWS items. -->
<!-- The first 10 items are automatically synced to README.md and README_zh.md via GitHub Actions. -->
<!-- To update news in READMEs, modify this file and push to trigger the workflow. -->

- **[2026-02] `功能`:** 支持实时语音交互。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/realtime_voice_agent) | [多智能体实时交互](https://github.com/agentscope-ai/agentscope/tree/main/examples/workflows/multiagent_realtime) | [文档](https://doc.agentscope.io/tutorial/task_realtime.html)
- **[2026-01] `社区`:** AgentScope 双周会议启动，分享生态更新和开发计划 - 欢迎加入！[详情与安排](https://github.com/agentscope-ai/agentscope/discussions/1126)
- **[2026-01] `功能`:** 记忆模块新增数据库支持和记忆压缩。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/short_term_memory/memory_compression) | [教程](https://doc.agentscope.io/tutorial/task_memory.html)
- **[2025-12] `集成`:** A2A（智能体间通信）协议支持。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/a2a_agent) | [教程](https://doc.agentscope.io/zh_CN/tutorial/task_a2a.html)
- **[2025-12] `功能`:** TTS（文本转语音）支持。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/tts) | [教程](https://doc.agentscope.io/zh_CN/tutorial/task_tts.html)
- **[2025-11] `集成`:** Anthropic Agent Skill 支持。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/agent_skill) | [教程](https://doc.agentscope.io/zh_CN/tutorial/task_agent_skill.html)
- **[2025-11] `发布`:** 面向多样化真实任务的 Alias-Agent 和数据处理的 Data-Juicer Agent 开源。[Alias-Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/alias) | [Data-Juicer Agent](https://github.com/agentscope-ai/agentscope-samples/tree/main/data_juicer_agent)
- **[2025-11] `集成`:** 通过 Trinity-RFT 库实现智能体强化学习。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/tuner/react_agent) | [Trinity-RFT](https://github.com/agentscope-ai/Trinity-RFT)
- **[2025-11] `集成`:** ReMe 增强长期记忆。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/long_term_memory/reme)
- **[2025-11] `发布`:** agentscope-samples 样例库上线，agentscope-runtime 升级支持 Docker/K8s 部署和 VNC 图形沙盒。[样例库](https://github.com/agentscope-ai/agentscope-samples) | [Runtime](https://github.com/agentscope-ai/agentscope-runtime)
- **[2025-11] `文档`:** 贡献指南上线 - 欢迎参与贡献！[指南](./CONTRIBUTING_zh.md)
- **[2025-09] `功能`:** RAG 模块发布。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/functionality/rag) | [教程](https://doc.agentscope.io/zh_CN/tutorial/task_rag.html)
- **[2025-09] `功能`:** 语音智能体支持 - ReActAgent 原生支持 Qwen-Omni 和 GPT-Audio。[样例](https://github.com/agentscope-ai/agentscope/tree/main/examples/agent/voice_agent) | [Roadmap](https://github.com/agentscope-ai/agentscope/issues/773)
- **[2025-09] `功能`:** Plan 模块发布。[教程](https://doc.agentscope.io/zh_CN/tutorial/task_plan.html)
- **[2025-09] `发布`:** AgentScope Runtime 开源 - 支持沙盒化工具执行的高效智能体部署。[GitHub](https://github.com/agentscope-ai/agentscope-runtime)
- **[2025-09] `发布`:** AgentScope Studio 开源。[GitHub](https://github.com/agentscope-ai/agentscope-studio)
- **[2025-08] `文档`:** v1 版本教程上线。[教程](https://doc.agentscope.io/zh_CN/)
- **[2025-08] `发布`:** AgentScope v1 发布 - 全面拥抱异步执行，诸多新功能和改进。[变更日志](https://github.com/agentscope-ai/agentscope/blob/main/docs/changelog.md)


================================================
FILE: docs/roadmap.md
================================================
# Roadmap

## Long-term Goals

Offering **agent-oriented programming (AOP)** as a new programming paradigm to organize the design and implementation of next-generation LLM-empowered applications.

## Current Focus (January 2026 - )

### 🎙️ Voice Agent

**Voice agents** are a domain we are highly focused on, and AgentScope will continue to invest in this direction.

AgentScope aims to build **production-ready** voice agents rather than demonstration prototypes. This means our voice agents will:

- Support **production-grade** deployment, including seamless frontend integration
- Support **tool invocation**, not just voice conversations
- Support **multi-agent** voice interactions

#### Development Roadmap

Our development strategy for voice agents consists of **three progressive milestones**:

1. **TTS Models** → 2. **Multimodal Models** → 3. **Real-time Multimodal Models**

---

#### Phase 1: TTS (Text-to-Speech) Models

- **Build TTS model base class infrastructure**
  - Design and implement a unified TTS model base class
  - Establish standardized interfaces for TTS model integration

- **Horizontal API expansion**
  - Support mainstream TTS APIs (e.g., OpenAI TTS, Google TTS, Azure TTS, ElevenLabs, etc.)
  - Ensure consistent behavior across different TTS providers

---

#### Phase 2: Multimodal Models (Non-Realtime)

- **Enable ReAct agents with multimodal support**
  - Integrate multimodal models (e.g., qwen3-omni, gpt-audio) into existing ReAct agent framework
  - Support audio input/output in non-realtime mode

- **Advanced multimodal agent capabilities**
  - Enable tool invocation within multimodal conversations
  - Support multi-agent workflows with multimodal communication

---

#### Phase 3: Real-time Multimodal Models


- **Beyond request-response**: Explore streaming, interrupt handling, and concurrent multimodal processing
- **New programming paradigms**: Design agent programming models specifically tailored for real-time interactions
- **Production readiness**: Ensure low-latency performance, stability, and scalability for production deployment

### 🛠️ Agent Skill

Provide **production-ready** agent skill integration solutions.

### 🌐 Ecosystem Expansion

- **A2UI (Agent-to-UI)**: Enable seamless agent-to-user interface interactions
- **A2A (Agent-to-Agent)**: Enhance agent-to-agent communication capabilities

### 🚀 Agentic RL

- Support using [Tinker](https://tinker-docs.thinkingmachines.ai/) backend to tune agent applications on devices without GPU.
- Support tuning agent applications based on their run history.
- Integrate with AgentScope Runtime to provide better environment abstraction.
- Add more tutorials and examples on how to build complex judge functions with the help of evaluation module.
- Add more tutorials and examples on data selection and augmentation.

### 📈 Code Quality

Continuous refinement and improvement of code quality and maintainability.

# Completed Milestones

### AgentScope V1.0.0 Roadmap

We are deeply grateful for the continuous support from the open-source community that has witnessed AgentScope's
growth. Throughout our journey, we have maintained **developer-centric transparency** as our core principle,
which will continue to guide our future development.

As the AI agent ecosystem rapidly evolves, we recognize the need to adapt AgentScope to meet emerging trends and
requirements. We are excited to announce the upcoming release of AgentScope v1.0.0, which marks a significant shift
towards deployment-focused and secondary development direction. This new version will provide comprehensive support for agent developers
with enhanced deployment capabilities and practical features. Specifically, the update will include:

- ✨New Features
  - 🛠️ Tool/MCP
    - Support both sync/async tool functions
    - Support streaming tool function
    - Support parallel execution of tool functions
    - Provide more flexible support for the MCP server

  - 💾 Memory
    - Enhance the existing short-term memory
    - Support long-term memory

  - 🤖 Agent
    - Provide powerful ReAct-based out-of-the-box agents

- 👨‍💻 Development
  - Provide enhanced AgentScope Studio with visual components for developing, tracing and debugging
  - Provide a built-in copilot for developing/drafting AgentScope applications

- 🔍 Evaluation
  - Provide built-in benchmarking and evaluation toolkit for agents
  - Support result visualization

- 🏗️ Deployment
  - Support asynchronous agent execution
  - Support session/state management
  - Provide sandbox for tool execution

Stay tuned for our detailed release notes and beta version, which will be available soon. Follow our GitHub
repository and official channels for the latest updates. We look forward to your valuable feedback and continued
support in shaping the future of AgentScope.


================================================
FILE: docs/tutorial/_static/language_switch.js
================================================
function switchV1Language() {
    if (window.location.href.includes("zh_CN")) {
        window.location.href = "https://doc.agentscope.io";
    } else {
        window.location.href = "https://doc.agentscope.io/zh_CN";
    }
}


function navigateToV0(version) {
    if (version === "v0") {
        const suffix = window.location.href.includes("zh_CN") ? "/zh_CN" : "/en";
        window.location.href = "https://doc.agentscope.io/v0" + suffix;
    }
}



================================================
FILE: docs/tutorial/_static/css/gallery.css
================================================
.sphx-glr-download-link-note.admonition.note {
    display: none;
}

.sphx-glr-footer {
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.sphx-glr-download-zip {
    display: none;
}

.bordered-image {
    border: 1px solid #e5e5e5;
}

:root {
    --item-card-width: 200px;
    --item-card-margin: 10px;
    --item-card-title-height: 50px;

    --item-card-img-length: calc(var(--item-card-width) - 2*var(--item-card-margin));
    --item-card-title-width: calc(var(--item-card-width) - 2*var(--item-card-margin));
    --item-card-title-margin-top: var(--item-card-margin);

    --item-card-height: calc(var(--item-card-margin) * 3 + var(--item-card-img-length) + var(--item-card-title-height));
}

td .highlight-python.notranslate {
    margin-bottom: 0 !important;
}

/*cite {*/
/*    background: rgba(229, 229, 229, 0.69) !important;*/
/*    padding-left: 0.25rem !important;*/
/*    padding-right: 0.25rem !important;*/
/*    border-radius: 4px !important;*/
/*    font-style: normal !important;*/
/*    font-weight: 600 !important;*/
/*}*/

.sidebar-brand-text {
    display: flex;
    justify-content: center;
}

.sidebar-logo-container .sidebar-logo {
    max-height: 170px;
    width: auto;
    display: block;
}

.gallery-item {
    position: relative;
    display: inline-block;
    width: var(--item-card-width);
    height: var(--item-card-height);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    margin: 7px;
}

.docutils.align-default {
    white-space: normal !important;
    max-width: 100% !important;
    width: 100% !important;
    td {
        white-space: normal !important;
    }
}

.sphx-glr-script-out.highlight-none.notranslate .highlight pre{
    /*正常打印回车*/
    white-space: pre-wrap !important;
    /*white-space: normal !important;*/
    max-width: 100% !important;
    width: 100% !important;
}

.gallery-item-card {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--item-card-width);
    height: var(--item-card-height);
    display: flex;
    flex-direction: column;
    margin: var(--item-card-margin);
}

.gallery-item-card-img {
    height: var(--item-card-img-length);
    width: var(--item-card-img-length);
    min-width: var(--item-card-img-length);
    min-height: var(--item-card-img-length);
    display: block;
}

.gallery-item-card-title {
    text-align: center;
    margin-top: var(--item-card-margin);
    font-weight: bold;
    min-height: var(--item-card-title-height);
    height: var(--item-card-title-height);
    width: var(--item-card-title-width);
    display: flex;
    align-items: center;
    justify-content: center;
}

.gallery-item-description {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    /*background-color: #1e8449;*/
    color: black;
    display: none;
    justify-content: center;
    align-items: flex-start;
}

.gallery-item:hover .gallery-item-description {
    display: flex;
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.22);
}

.language-switch-button {
    background: transparent;
    display: flex;
    align-content: center;
    justify-content: center;
    font-size: 15px;
    margin-top: 0;
    margin-bottom: 4px;
    border: none;
    color: rgb(4, 4, 4);
    height: 20px;
    width: 20px;
    border-radius: 6px;
    font-weight: 325;
}

.language-switch-button:hover {
    color: #2758DA;
}

.version-select {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    font-size: 14px;
    border: 1px solid rgb(238, 235, 238);
    margin-inline: 16px;
    padding: 8px;
    height: fit-content;
    box-sizing: border-box;
    font-weight: 600;
    border-radius: 6px;
    fill: rgb(238, 235, 238);
}



================================================
FILE: docs/tutorial/_static/images/studio_project.webp
================================================
[Binary file]


================================================
FILE: docs/tutorial/_templates/module.rst_t
================================================
{{ basename |  heading }}
.. automodule:: {{ qualname }}
{%- for option in automodule_options %}
   :{{ option }}:
{%- endfor %}


================================================
FILE: docs/tutorial/_templates/package.rst_t
================================================
{%- macro automodule(modname, options) -%}
.. automodule:: {{ modname }}
{%- for option in options %}
   :{{ option }}:
{%- endfor %}
{%- endmacro %}

{{- pkgname | heading }}

{{ automodule(pkgname, automodule_options) }}


================================================
FILE: docs/tutorial/_templates/page.html
================================================
{% extends "base.html" %}

{% block body -%}
{{ super() }}
{% include "partials/icons.html" %}

<input type="checkbox" class="sidebar-toggle" name="__navigation" id="__navigation">
<input type="checkbox" class="sidebar-toggle" name="__toc" id="__toc">
<label class="overlay sidebar-overlay" for="__navigation">
  <div class="visually-hidden">Hide navigation sidebar</div>
</label>
<label class="overlay toc-overlay" for="__toc">
  <div class="visually-hidden">Hide table of contents sidebar</div>
</label>

<a class="skip-to-content muted-link" href="#furo-main-content">
  {%- trans -%}
  Skip to content
  {%- endtrans -%}
</a>

{% if theme_announcement -%}
<div class="announcement">
  <aside class="announcement-content">
    {% block announcement %} {{ theme_announcement }} {% endblock announcement %}
  </aside>
</div>
{%- endif %}

<div class="page">
  <header class="mobile-header">
    <div class="header-left">
      <label class="nav-overlay-icon" for="__navigation">
        <div class="visually-hidden">Toggle site navigation sidebar</div>
        <i class="icon"><svg><use href="#svg-menu"></use></svg></i>
      </label>
    </div>
    <div class="header-center">
      <a href="{{ pathto(master_doc) }}"><div class="brand">{{ docstitle if docstitle else project }}</div></a>
    </div>
    <div class="header-right">
      <div class="theme-toggle-container theme-toggle-header">
        <button class="theme-toggle">
          <div class="visually-hidden">Toggle Light / Dark / Auto color theme</div>
          <svg class="theme-icon-when-auto-light"><use href="#svg-sun-with-moon"></use></svg>
          <svg class="theme-icon-when-auto-dark"><use href="#svg-moon-with-sun"></use></svg>
          <svg class="theme-icon-when-dark"><use href="#svg-moon"></use></svg>
          <svg class="theme-icon-when-light"><use href="#svg-sun"></use></svg>
        </button>
      </div>
      <label class="toc-overlay-icon toc-header-icon{% if furo_hide_toc %} no-toc{% endif %}" for="__toc">
        <div class="visually-hidden">Toggle table of contents sidebar</div>
        <i class="icon"><svg><use href="#svg-toc"></use></svg></i>
      </label>
    </div>
  </header>
  <aside class="sidebar-drawer">
    <div class="sidebar-container">
      {% block left_sidebar %}
      <div class="sidebar-sticky">
        {%- for sidebar_section in sidebars %}
          {%- include sidebar_section %}
        {%- endfor %}
      </div>
      {% endblock left_sidebar %}
    </div>
  </aside>
  <div class="main">
    <div class="content">
      <div class="article-container">
        <a href="#" class="back-to-top muted-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M13 20h-2V8l-5.5 5.5-1.42-1.42L12 4.16l7.92 7.92-1.42 1.42L13 8v12z"></path>
          </svg>
          <span>{% trans %}Back to top{% endtrans %}</span>
        </a>
        <div class="content-icon-container">
          {% if theme_top_of_page_button != "edit" -%}
            {{ warning("Got configuration for 'top_of_page_button': this is deprecated.") }}
          {%- endif -%}

          {%- if theme_top_of_page_buttons == "" -%}
            {% if theme_top_of_page_button == None -%}
              {#- We respect the old configuration of disabling all the buttons -#}
              {%- set theme_top_of_page_buttons = [] -%}
            {% else %}
              {%- set theme_top_of_page_buttons = ["view", "edit"] -%}
            {%- endif -%}
          {% else -%}
            {% if theme_top_of_page_button != "edit" -%}
              {%- set theme_top_of_page_buttons = [] -%}
              {{ warning("Got configuration for both 'top_of_page_button' and 'top_of_page_buttons', ignoring both and removing all top of page buttons.") }}
            {%- endif -%}
          {%- endif -%}
          {%- include "components/language-switch.html" with context -%}
          {% for button in theme_top_of_page_buttons -%}
            {% if button == "view" %}
            {%- include "components/view-this-page.html" with context -%}
            {% elif button == "edit" %}
            {%- include "components/edit-this-page.html" with context -%}
            {% else %}
            {{ warning("Got an unsupported value in 'top_of_page_buttons' for theme configuration") }}
            {% endif %}
          {%- endfor -%}
          {#- Theme toggle -#}
          <div class="theme-toggle-container theme-toggle-content">
            <button class="theme-toggle">
              <div class="visually-hidden">Toggle Light / Dark / Auto color theme</div>
              <svg class="theme-icon-when-auto-light"><use href="#svg-sun-with-moon"></use></svg>
              <svg class="theme-icon-when-auto-dark"><use href="#svg-moon-with-sun"></use></svg>
              <svg class="theme-icon-when-dark"><use href="#svg-moon"></use></svg>
              <svg class="theme-icon-when-light"><use href="#svg-sun"></use></svg>
            </button>
          </div>
          <label class="toc-overlay-icon toc-content-icon{% if furo_hide_toc %} no-toc{% endif %}" for="__toc">
            <div class="visually-hidden">Toggle table of contents sidebar</div>
            <i class="icon"><svg><use href="#svg-toc"></use></svg></i>
          </label>
        </div>
        <article role="main" id="furo-main-content">
          {% block content %}{{ body }}{% endblock %}
        </article>
      </div>
      <footer>
        {% block footer %}
        <div class="related-pages">
          {% if next -%}
            <a class="next-page" href="{{ next.link }}">
              <div class="page-info">
                <div class="context">
                  <span>{{ _("Next") }}</span>
                </div>
                <div class="title">{{ next.title }}</div>
              </div>
              <svg class="furo-related-icon"><use href="#svg-arrow-right"></use></svg>
            </a>
          {%- endif %}
          {% if prev -%}
            <a class="prev-page" href="{{ prev.link }}">
              <svg class="furo-related-icon"><use href="#svg-arrow-right"></use></svg>
              <div class="page-info">
                <div class="context">
                  <span>{{ _("Previous") }}</span>
                </div>
                {% if prev.link == pathto(master_doc) %}
                <div class="title">{{ _("Home") }}</div>
                {% else %}
                <div class="title">{{ prev.title }}</div>
                {% endif %}
              </div>
            </a>
          {%- endif %}
        </div>
        <div class="bottom-of-page">
          <div class="left-details">
            {%- if show_copyright %}
            <div class="copyright">
              {%- if hasdoc('copyright') %}
                {% trans path=pathto('copyright'), copyright=copyright|e -%}
                  <a href="{{ path }}">Copyright</a> &#169; {{ copyright }}
                {%- endtrans %}
              {%- else %}
                {% trans copyright=copyright|e -%}
                  Copyright &#169; {{ copyright }}
                {%- endtrans %}
              {%- endif %}
            </div>
            {%- endif %}
            {% trans %}Made with {% endtrans -%}
            {%- if show_sphinx -%}
            {% trans %}<a href="https://www.sphinx-doc.org/">Sphinx</a> and {% endtrans -%}
            <a class="muted-link" href="https://pradyunsg.me">@pradyunsg</a>'s
            {% endif -%}
            {% trans %}
            <a href="https://github.com/pradyunsg/furo">Furo</a>
            {% endtrans %}
            {%- if last_updated -%}
            <div class="last-updated">
              {% trans last_updated=last_updated|e -%}
                Last updated on {{ last_updated }}
              {%- endtrans -%}
            </div>
            {%- endif %}
          </div>
          <div class="right-details">
            {% if theme_footer_icons or READTHEDOCS -%}
            <div class="icons">
              {% if theme_footer_icons -%}
              {% for icon_dict in theme_footer_icons -%}
              <a class="muted-link {{ icon_dict.class }}" href="{{ icon_dict.url }}" aria-label="{{ icon_dict.name }}">
                {{- icon_dict.html -}}
              </a>
              {% endfor %}
              {%- else -%}
              {#- Show Read the Docs project -#}
              {%- if READTHEDOCS and slug -%}
              <a class="muted-link" href="https://readthedocs.org/projects/{{ slug }}" aria-label="On Read the Docs">
                <svg x="0px" y="0px" viewBox="-125 217 360 360" xml:space="preserve">
                  <path fill="currentColor" d="M39.2,391.3c-4.2,0.6-7.1,4.4-6.5,8.5c0.4,3,2.6,5.5,5.5,6.3 c0,0,18.5,6.1,50,8.7c25.3,2.1,54-1.8,54-1.8c4.2-0.1,7.5-3.6,7.4-7.8c-0.1-4.2-3.6-7.5-7.8-7.4c-0.5,0-1,0.1-1.5,0.2 c0,0-28.1,3.5-50.9,1.6c-30.1-2.4-46.5-7.9-46.5-7.9C41.7,391.3,40.4,391.1,39.2,391.3z M39.2,353.6c-4.2,0.6-7.1,4.4-6.5,8.5 c0.4,3,2.6,5.5,5.5,6.3c0,0,18.5,6.1,50,8.7c25.3,2.1,54-1.8,54-1.8c4.2-0.1,7.5-3.6,7.4-7.8c-0.1-4.2-3.6-7.5-7.8-7.4 c-0.5,0-1,0.1-1.5,0.2c0,0-28.1,3.5-50.9,1.6c-30.1-2.4-46.5-7.9-46.5-7.9C41.7,353.6,40.4,353.4,39.2,353.6z M39.2,315.9 c-4.2,0.6-7.1,4.4-6.5,8.5c0.4,3,2.6,5.5,5.5,6.3c0,0,18.5,6.1,50,8.7c25.3,2.1,54-1.8,54-1.8c4.2-0.1,7.5-3.6,7.4-7.8 c-0.1-4.2-3.6-7.5-7.8-7.4c-0.5,0-1,0.1-1.5,0.2c0,0-28.1,3.5-50.9,1.6c-30.1-2.4-46.5-7.9-46.5-7.9 C41.7,315.9,40.4,315.8,39.2,315.9z M39.2,278.3c-4.2,0.6-7.1,4.4-6.5,8.5c0.4,3,2.6,5.5,5.5,6.3c0,0,18.5,6.1,50,8.7 c25.3,2.1,54-1.8,54-1.8c4.2-0.1,7.5-3.6,7.4-7.8c-0.1-4.2-3.6-7.5-7.8-7.4c-0.5,0-1,0.1-1.5,0.2c0,0-28.1,3.5-50.9,1.6 c-30.1-2.4-46.5-7.9-46.5-7.9C41.7,278.2,40.4,278.1,39.2,278.3z M-13.6,238.5c-39.6,0.3-54.3,12.5-54.3,12.5v295.7 c0,0,14.4-12.4,60.8-10.5s55.9,18.2,112.9,19.3s71.3-8.8,71.3-8.8l0.8-301.4c0,0-25.6,7.3-75.6,7.7c-49.9,0.4-61.9-12.7-107.7-14.2 C-8.2,238.6-10.9,238.5-13.6,238.5z M19.5,257.8c0,0,24,7.9,68.3,10.1c37.5,1.9,75-3.7,75-3.7v267.9c0,0-19,10-66.5,6.6 C59.5,536.1,19,522.1,19,522.1L19.5,257.8z M-3.6,264.8c4.2,0,7.7,3.4,7.7,7.7c0,4.2-3.4,7.7-7.7,7.7c0,0-12.4,0.1-20,0.8 c-12.7,1.3-21.4,5.9-21.4,5.9c-3.7,2-8.4,0.5-10.3-3.2c-2-3.7-0.5-8.4,3.2-10.3c0,0,0,0,0,0c0,0,11.3-6,27-7.5 C-16,264.9-3.6,264.8-3.6,264.8z M-11,302.6c4.2-0.1,7.4,0,7.4,0c4.2,0.5,7.2,4.3,6.7,8.5c-0.4,3.5-3.2,6.3-6.7,6.7 c0,0-12.4,0.1-20,0.8c-12.7,1.3-21.4,5.9-21.4,5.9c-3.7,2-8.4,0.5-10.3-3.2c-2-3.7-0.5-8.4,3.2-10.3c0,0,11.3-6,27-7.5 C-20.5,302.9-15.2,302.7-11,302.6z M-3.6,340.2c4.2,0,7.7,3.4,7.7,7.7s-3.4,7.7-7.7,7.7c0,0-12.4-0.1-20,0.7 c-12.7,1.3-21.4,5.9-21.4,5.9c-3.7,2-8.4,0.5-10.3-3.2c-2-3.7-0.5-8.4,3.2-10.3c0,0,11.3-6,27-7.5C-16,340.1-3.6,340.2-3.6,340.2z" />
                </svg>
              </a>
              {%- endif -%}
              {#- Show GitHub repository home -#}
              {%- if READTHEDOCS and display_github and github_user != "None" and github_repo != "None" -%}
              <a class="muted-link" href="https://github.com/{{ github_user }}/{{ github_repo }}" aria-label="On GitHub">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </a>
              {%- endif -%}
              {%- endif %}
            </div>
            {%- endif %}
          </div>
        </div>
        {% endblock footer %}
      </footer>
    </div>
    <aside class="toc-drawer{% if furo_hide_toc %} no-toc{% endif %}">
      {% block right_sidebar %}
      {% if not furo_hide_toc %}
      <div class="toc-sticky toc-scroll">
        <div class="toc-title-container">
          <span class="toc-title">
            {{ _("On this page") }}
          </span>
        </div>
        <div class="toc-tree-container">
          <div class="toc-tree">
            {{ toc }}
          </div>
        </div>
      </div>
      {% endif %}
      {% endblock right_sidebar %}
    </aside>
  </div>
</div>
{%- endblock %}



================================================
FILE: docs/tutorial/_templates/components/language-switch.html
================================================
{# _templates/components/language-switch.html #}
<button onclick="switchV1Language()" class="language-switch-button" title="Switch to Chinese">
  <script>
    document.write(window.location.href.includes("zh_CN") ? "En": "中");
  </script>
</button>


================================================
FILE: docs/tutorial/_templates/sidebar/navigation.html
================================================
<div class="sidebar-tree">
    <p class="caption" role="heading">
        <span class="caption-text">
            Version
        </span>
        <ul>
            <li>
                <select class="version-select" onchange="navigateToV0(this.value)">
                    <option value="v1" selected>Stable(v1.0)</option>
                    <option value="v0">v0.1.x</option>
                </select>
            </li>
        </ul>
    </p>
    {{ furo_navigation_tree }}
</div>



================================================
FILE: docs/tutorial/en/build.sh
================================================
#!/bin/bash

set -e

# Clean old build files
rm -rf build/ doctrees/

# Build the html
sphinx-build -M html ./ build

# Remove temporary files (double insurance)
rm -rf build/html/.doctrees
rm -f build/html/.buildinfo
find build/html -name "*.pickle" -delete
find build/html -name "__pycache__" -delete
find build/html -name "*.pyc" -delete

echo "✅ English docs built successfully, temporary files cleaned"


================================================
FILE: docs/tutorial/en/conf.py
================================================
# -*- coding: utf-8 -*-
# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "AgentScope"
copyright = "2025, Alibaba"
author = "Alibaba Tongyi Lab"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "myst_parser",
    "sphinx_gallery.gen_gallery",
    "sphinx.ext.autodoc",
    "sphinx.ext.viewcode",
    "sphinx.ext.napoleon",
]

myst_enable_extensions = [
    "colon_fence",
]

sphinx_gallery_conf = {
    "download_all_examples": False,
    "examples_dirs": [
        "src",
    ],
    "gallery_dirs": [
        "tutorial",
    ],
    "filename_pattern": "src/.*\.py",
    "example_extensions": [".py"],
}

templates_path = ["../_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

languages = ["en", "zh_CN"]
language = "en"

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "furo"
html_title = (
    "<span style='font-weight: 700; color: #2196f3;'>AgentScope</span>"
)
html_logo = "../_static/images/logo.svg"
html_favicon = "../_static/images/logo.svg"
html_static_path = ["../_static"]
html_css_files = [
    "css/gallery.css",
]

html_js_files = [
    "language_switch.js",
]

html_theme_options = {
    "footer_icons": [
        {
            "name": "GitHub",
            "url": "https://github.com/agentscope-ai/agentscope",
            "html": """
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            """,
            "class": "",
        },
        {
            "name": "Discord",
            "url": "https://discord.gg/eYMpfnkG8h",
            "html": """
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" t="1753331148815" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5721" width="200" height="200">
                    <path d="M723.903423 359.138018c-69.65045-52.952793-136.256577-51.476757-136.256576-51.476757l-6.088649 7.564685c83.027027 25.738378 121.127207 62.085766 121.127207 62.085766a387.459459 387.459459 0 0 0-145.297297-46.956397 418.179459 418.179459 0 0 0-98.340901 1.752793 73.801802 73.801802 0 0 1-7.564684 1.476036 357.385225 357.385225 0 0 0-110.702703 30.258739 278.786306 278.786306 0 0 0-28.782703 13.653333S353.049369 339.488288 440.873514 313.657658l-4.612613-6.088649s-66.513874-1.476036-136.164324 51.476757A654.252973 654.252973 0 0 0 230.630631 642.167928s40.867748 71.126486 148.341621 73.801802c0 0 16.697658-22.694054 31.827027-40.867748-62.085766-18.45045-84.77982-57.565405-84.77982-57.565405a130.998198 130.998198 0 0 0 13.653334 7.564684s0 1.568288 1.476036 1.568289c1.476036 1.476036 3.044324 1.476036 4.52036 3.044324a238.748829 238.748829 0 0 0 34.779099 16.605405 513.199279 513.199279 0 0 0 71.218739 21.218018 350.558559 350.558559 0 0 0 125.555315 0 329.894054 329.894054 0 0 0 69.650451-21.218018A247.328288 247.328288 0 0 0 702.685405 618.09009s-24.262342 39.391712-87.824144 57.565405c13.653333 18.45045 31.827027 39.299459 31.827027 39.29946 107.473874-2.952072 148.341622-73.801802 146.773334-72.602523a654.990991 654.990991 0 0 0-69.558199-283.214414zM421.131532 596.77982a54.705586 54.705586 0 0 1 0-109.042162 54.705586 54.705586 0 0 1 0 109.042162z m177.124324 0a54.705586 54.705586 0 1 1 49.908468-54.521081 52.491532 52.491532 0 0 1-49.908468 54.521081z" p-id="5722"></path><path d="M512 1024A512 512 0 1 1 1024 512 512.645766 512.645766 0 0 1 512 1024z m0-972.892252a461.261261 461.261261 0 1 0 461.261261 461.261261 461.261261 461.261261 0 0 0-461.261261-461.261261z" p-id="5723"></path>
                </svg>
            """,
            "class": "",
        },
        {
            "name": "DingTalk",
            "url": "https://qr.dingtalk.com/action/joingroup?code=v1,k1,OmDlBXpjW+I2vWjKDsjvI9dhcXjGZi3bQiojOq3dlDw=&_dt_no_comment=1&origin=11",
            "html": """
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024">
                    <path d="M512 0C229.205333 0 0 229.205333 0 512s229.205333 512 512 512 512-229.205333 512-512S794.794667 0 512 0z m237.312 480.810667c-1.109333 4.48-3.712 11.093333-7.424 18.986666h0.128l-0.426667 0.682667c-21.504 46.037333-77.610667 136.106667-77.610666 136.106667l-0.298667-0.597334-16.384 28.501334h79.018667l-150.912 200.917333 34.304-136.533333h-62.208l21.589333-90.282667c-17.493333 4.224-38.101333 10.026667-62.592 17.92 0 0-33.109333 19.370667-95.317333-37.333333 0 0-41.984-36.992-17.578667-46.165334 10.410667-3.925333 50.304-8.917333 81.706667-13.226666 42.410667-5.674667 68.48-8.789333 68.48-8.789334s-130.773333 2.005333-161.792-2.901333c-30.976-4.906667-70.4-56.704-78.805334-102.186667 0 0-12.970667-25.002667 27.904-13.226666 40.917333 11.818667 210.005333 46.08 210.005334 46.08S321.109333 411.434667 306.517333 394.922667c-14.634667-16.469333-43.093333-89.770667-39.424-134.869334 0 0 1.621333-11.221333 13.098667-8.192 0 0 162.602667 74.282667 273.792 114.986667 111.104 40.704 207.786667 61.397333 195.328 114.005333z" opacity=".65" p-id="6077"></path>
                </svg>
            """,
            "class": "",
        },
    ],
    "light_css_variables": {
        "color-brand-primary": "#2196f3",
        "color-brand-content": "#2196f3",
        "color-admonition-background": "#f8f9fa",
    },
    "dark_css_variables": {
        "color-link": "#2196f3",
        "color-link--hover": "#2196f3",
        "color-brand-primary": "#64b5f6",
        "color-brand-content": "#64b5f6",
    },
}

source_suffix = [".md", ".rst"]


# -- Options for API documentation -------------------------------------------

autodoc_member_order = "bysource"
autodoc_typehints = "description"
autodoc_class_signature = "separated"
autodoc_default_options = {
    "special-members": "__call__",
}

add_module_names = False
python_display_short_literal_types = True


def skip_member(app, what, name, obj, skip, options):
    if name in [
        "__call__",
        "_format",
        "_format_agent_message",
        "_format_tool_sequence",
    ]:
        return False

    return skip


def setup(app):
    app.connect("autodoc-skip-member", skip_member)



================================================
FILE: docs/tutorial/en/index.rst
================================================
.. AgentScope Doc documentation master file, created by
   sphinx-quickstart on Thu Aug  8 15:07:21 2024.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to AgentScope's documentation!
==========================================

.. toctree::
   :maxdepth: 1
   :caption: Tutorial

   tutorial/quickstart_installation
   tutorial/quickstart_key_concept
   tutorial/quickstart_message
   tutorial/quickstart_agent

.. toctree::
   :maxdepth: 1
   :caption: Workflow

   tutorial/workflow_conversation
   tutorial/workflow_multiagent_debate
   tutorial/workflow_concurrent_agents
   tutorial/workflow_routing
   tutorial/workflow_handoffs

.. toctree::
   :maxdepth: 1
   :caption: FAQ

   tutorial/faq

.. toctree::
   :maxdepth: 1
   :caption: Model and Context

   tutorial/task_model
   tutorial/task_prompt
   tutorial/task_token
   tutorial/task_memory
   tutorial/task_long_term_memory

.. toctree::
   :maxdepth: 1
   :caption: Tool

   tutorial/task_tool
   tutorial/task_mcp
   tutorial/task_agent_skill

.. toctree::
   :maxdepth: 1
   :caption: Agent

   tutorial/task_agent
   tutorial/task_state
   tutorial/task_hook
   tutorial/task_middleware
   tutorial/task_a2a
   tutorial/task_realtime

.. toctree::
   :maxdepth: 1
   :caption: Features

   tutorial/task_pipeline
   tutorial/task_plan
   tutorial/task_rag
   tutorial/task_studio
   tutorial/task_tracing
   tutorial/task_eval
   tutorial/task_eval_openjudge
   tutorial/task_embedding
   tutorial/task_tts
   tutorial/task_tuner



================================================
FILE: docs/tutorial/en/make.bat
================================================
@ECHO OFF

pushd %~dp0

REM Command file for Sphinx documentation

if "%SPHINXBUILD%" == "" (
	set SPHINXBUILD=sphinx-build
)
set SOURCEDIR=source
set BUILDDIR=build

%SPHINXBUILD% >NUL 2>NUL
if errorlevel 9009 (
	echo.
	echo.The 'sphinx-build' command was not found. Make sure you have Sphinx
	echo.installed, then set the SPHINXBUILD environment variable to point
	echo.to the full path of the 'sphinx-build' executable. Alternatively you
	echo.may add the Sphinx directory to PATH.
	echo.
	echo.If you don't have Sphinx installed, grab it from
	echo.https://www.sphinx-doc.org/
	exit /b 1
)

if "%1" == "" goto help

%SPHINXBUILD% -M %1 %SOURCEDIR% %BUILDDIR% %SPHINXOPTS% %O%
goto end

:help
%SPHINXBUILD% -M help %SOURCEDIR% %BUILDDIR% %SPHINXOPTS% %O%

:end
popd



================================================
FILE: docs/tutorial/en/Makefile
================================================
# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line, and also
# from the environment for the first two.
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = source
BUILDDIR      = _build

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

.PHONY: help Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)



================================================
FILE: docs/tutorial/en/src/README.md
================================================
[Empty file]


================================================
FILE: docs/tutorial/en/src/faq.py
================================================
# -*- coding: utf-8 -*-
"""
.. _faq:

FAQ
========================================

About AgentScope
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*What is AgentScope?*
    AgentScope is a multi-agent framework, aiming to provide a simple yet efficient way to build LLM-empowered agent applications.

*What is the difference between AgentScope v1.0 and v0.x?*
    AgentScope v1.0 is a complete refactoring of the framework, equipped with new features and improvements. Refer to for detailed changes.


About Model
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*How to integrate my own model with AgentScope?*
    Create your own model by inheriting ``agentscope.model.ChatModelBase`` and implement the ``__call__`` method.

*What models are supported by AgentScope?*
    Currently, AgentScope has built-in support for DashScope, Gemini, OpenAI, Anthropic, and Ollama APIs, and the ``OpenAIChatModel`` compatible with DeepSeek and vLLMs models.

*How to monitor the token usage in AgentScope?*
    In AgentScope Studio, we provide visualization of token usage and tracing. Refer :ref:`studio` section for more details.


About Agent
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*How to create my own agent?*
    You can choose to use the ``ReActAgent`` class directly, or create your own agent by inheriting from ``AgentBase`` or ``ReActAgentBase`` classes. Refer to the :ref:`agent` section for more details.


*How to forward the (streaming) output of agents to my own frontend or application?*
    Use the pre hook of the ``print`` function to forward printing messages. Refer to the :ref:`hook` section.


About Tools
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*How many tools are provided by AgentScope?*
    AgentScope provides a set of built-in tools, including ``execute_python_code``, ``execute_shell_command``, ``write_text_file`` , etc. You can find them under ``agentscope.tool`` module.


About Reporting Bugs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*How can I report a bug in AgentScope?*
    If you encounter a bug while using AgentScope, please report it by opening an issue on our GitHub repository.

*How can I report a security bug in AgentScope?*
    If you discover a security issue in AgentScope, please report it to us through the `Alibaba Security Response Center (ASRC) <https://security.alibaba.com/>`_.

"""



================================================
FILE: docs/tutorial/en/src/quickstart_agent.py
================================================
# -*- coding: utf-8 -*-
"""
.. _react-agent:

Create ReAct Agent
====================

AgentScope provides out-of-the-box ReAct agent ``ReActAgent`` under ``agentscope.agent`` that can be used directly.

It supports the following features at the same time:

- ✨ Basic features
    - Support **hooks** around ``reply``, ``observe``, ``print``, ``_reasoning`` and ``_acting`` functions
    - Support structured output
- ✋ Realtime Steering
    - Support user **interrupt**
    - Support customized **interruption handling**
- 🛠️ Tools
    - Support both **sync/async** tool functions
    - Support **streaming** tool response
    - Support **stateful** tools management
    - Support **parallel** tool calls
    - Support **MCP** server
- 💾 Memory
    - Support **agent-controlled** long-term memory management
    - Support static long-term memory management

.. tip:: Refer to the :ref:`agent` section for more details about these
 features. In quickstart, we focus on how to create a ReAct agent and run it.

"""

from agentscope.agent import ReActAgent, AgentBase
from agentscope.formatter import DashScopeChatFormatter
from agentscope.memory import InMemoryMemory
from agentscope.message import Msg
from agentscope.model import DashScopeChatModel
import asyncio
import os

from agentscope.tool import Toolkit, execute_python_code


# %%
# Creating ReAct Agent
# ------------------------------
# To improve the flexibility, the ``ReActAgent`` class exposes the following parameters in its constructor:
#
# .. list-table:: Initialization parameters of ``ReActAgent`` class
#   :header-rows: 1
#
#   * - Parameter
#     - Further Reading
#     - Description
#   * - ``name`` (required)
#     -
#     - The name of the agent
#   * - ``sys_prompt`` (required)
#     -
#     - The system prompt of the agent
#   * - ``model`` (required)
#     - :ref:`model`
#     - The model used by the agent to generate responses
#   * - ``formatter`` (required)
#     - :ref:`prompt`
#     - The prompt construction strategy, should be consistent with the model
#   * - ``toolkit``
#     - :ref:`tool`
#     - The toolkit to register/call tool functions.
#   * - ``memory``
#     - :ref:`memory`
#     - The short-term memory used to store the conversation history
#   * - ``long_term_memory``
#     - :ref:`long-term-memory`
#     - The long-term memory
#   * - ``long_term_memory_mode``
#     - :ref:`long-term-memory`
#     - The mode of the long-term memory:
#
#       - ``agent_control``: allow agent to control the long-term memory by itself
#       - ``static_control``: retrieving and recording from/to long-term memory will happen in the beginning/end of each reply.
#       - ``both``: activate the above two modes at the same time
#   * - ``enable_meta_tool``
#     - :ref:`tool`
#     - Whether to enable the meta tool, which allows the agent to manage tools by itself
#   * - ``parallel_tool_calls``
#     - :ref:`agent`
#     - Whether to allow parallel tool calls
#   * - ``max_iters``
#     -
#     - The maximum number of iterations for the agent to generate a response
#   * - ``plan_notebook``
#     - :ref:`plan`
#     - The plan notebook to manage the plans
#   * - ``print_hint_msg``
#     -
#     - Whether to print the hint message generated by the plan notebook at each step
#
# Taking DashScope API as example, we create an agent object as follows:


async def creating_react_agent() -> None:
    """Create a ReAct agent and run a simple task."""
    # Prepare tools
    toolkit = Toolkit()
    toolkit.register_tool_function(execute_python_code)

    jarvis = ReActAgent(
        name="Jarvis",
        sys_prompt="You're a helpful assistant named Jarvis",
        model=DashScopeChatModel(
            model_name="qwen-max",
            api_key=os.environ["DASHSCOPE_API_KEY"],
            stream=True,
            enable_thinking=False,
        ),
        formatter=DashScopeChatFormatter(),
        toolkit=toolkit,
        memory=InMemoryMemory(),
    )

    msg = Msg(
        name="user",
        content="Hi! Jarvis, run Hello World in Python.",
        role="user",
    )

    await jarvis(msg)


asyncio.run(creating_react_agent())

# %%
# Creating From Scratch
# --------------------------------
# You may want to create an agent from scratch, AgentScope provides two base classes for you to inherit from:
#
# .. list-table::
#   :header-rows: 1
#
#   * - Class
#     - Abstract Methods
#     - Description
#   * - ``AgentBase``
#     - | ``reply``
#       | ``observe``
#       | ``handle_interrupt``
#     - - The base class for all agents, supporting pre- and post- hooks around ``reply``, ``observe`` and ``print`` functions.
#       - Implement the realtime steering within the ``__call__`` method.
#   * - ``ReActAgentBase``
#     - | ``reply``
#       | ``observe``
#       | ``handle_interrupt``
#       | ``_reasoning``
#       | ``_acting``
#     - Add two abstract functions ``_reasoning`` and ``_acting`` on the basis of ``AgentBase``, as well as their hooks.
#
# Please refer to the :ref:`agent` section for more details about the agent class.
#
# Taking the ``AgentBase`` class as an example, we can create a custom agent
# class by inheriting from it and implementing the ``reply`` method.


class MyAgent(AgentBase):
    """A custom agent class"""

    def __init__(self) -> None:
        """Initialize the agent"""
        super().__init__()

        self.name = "Friday"
        self.sys_prompt = "You're a helpful assistant named Friday."
        self.model = DashScopeChatModel(
            model_name="qwen-max",
            api_key=os.environ["DASHSCOPE_API_KEY"],
            stream=False,
        )
        self.formatter = DashScopeChatFormatter()
        self.memory = InMemoryMemory()

    async def reply(self, msg: Msg | list[Msg] | None) -> Msg:
        """Reply to the message."""
        await self.memory.add(msg)

        # Prepare the prompt
        prompt = await self.formatter.format(
            [
                Msg("system", self.sys_prompt, "system"),
                *await self.memory.get_memory(),
            ],
        )

        # Call the model
        response = await self.model(prompt)

        msg = Msg(
            name=self.name,
            content=response.content,
            role="assistant",
        )

        # Record the response in memory
        await self.memory.add(msg)

        # Print the message
        await self.print(msg)
        return msg

    async def observe(self, msg: Msg | list[Msg] | None) -> None:
        """Observe the message."""
        # Store the message in memory
        await self.memory.add(msg)

    async def handle_interrupt(self) -> Msg:
        """Postprocess the interrupt."""
        # Taking a fixed response as example
        return Msg(
            name=self.name,
            content="I noticed you interrupted me, how can I help you?",
            role="assistant",
        )


async def run_custom_agent() -> None:
    """Run the custom agent."""
    agent = MyAgent()
    msg = Msg(
        name="user",
        content="Who are you?",
        role="user",
    )
    await agent(msg)


asyncio.run(run_custom_agent())

# %%
#
# Further Reading
# ---------------------
# - :ref:`agent`
# - :ref:`model`
# - :ref:`prompt`
# - :ref:`tool`
#



================================================
FILE: docs/tutorial/en/src/quickstart_installation.py
================================================
# -*- coding: utf-8 -*-
"""
.. _installation:

Installation
============================

AgentScope requires Python 3.10 or higher. You can install from source or pypi.

From PyPI
----------------
.. code-block:: bash

    pip install agentscope

From Source
----------------
To install AgentScope from source, you need to clone the repository from
GitHub and install by the following commands

.. code-block:: bash

    git clone -b main https://github.com/agentscope-ai/agentscope
    cd agentscope
    pip install -e .

To ensure AgentScope is installed successfully, check via executing the following code:
"""

import agentscope

print(agentscope.__version__)

# %%
# Extra Dependencies
# ----------------------------
#
# To satisfy the requirements of different functionalities, AgentScope provides
# extra dependencies that can be installed based on your needs.
#
# - full: Including extra dependencies for model APIs and tool functions
# - dev: Development dependencies, including testing and documentation tools
#
# For example, when installing the full dependencies, the installation command varies depending on your operating system.
#
# For Windows users:
#
# .. code-block:: bash
#
#       pip install agentscope[full]
#
# For Mac and Linux users:
#
# .. code-block:: bash
#
#       pip install agentscope\[full\]



================================================
FILE: docs/tutorial/en/src/quickstart_key_concept.py
================================================
# -*- coding: utf-8 -*-
"""
.. key-concepts:

Key Concepts
====================================

This chapter establishes key concepts from an engineering
perspective to introduce AgentScope's design.

.. note:: The goal of introducing the key concepts in AgentScope is to claim what practical problems AgentScope addresses and how it supports developers, rather than to offer formal definitions.

State
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In AgentScope, state management is a fundamental building block that maintains snapshots of objects' runtime data.

AgentScope separates object initialization from state management, allowing
object to be restored to different states after initialization through
``load_state_dict`` and ``state_dict`` methods.

In AgentScope, agent, memory, long-term memory and toolkit are all stateful
objects. AgentScope links the state management of these objects together by supporting nested state management.

Message
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
In AgentScope, message is the fundamental data structure,
used to

- exchange information between agents,
- display information in the user interface,
- store information in memory,
- act as a unified medium between AgentScope and different LLM APIs.

Tool
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
A tool in AgentScope refers to callable object, no matter it's a

- function,
- partial function,
- instance method,
- class method,
- static method, or
- callable instance with ``__call__`` method.

Besides, the callable object can be either

- async or sync,
- streaming or non-streaming.

So feel free to use any callable object as a tool in AgentScope.

Agent
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
In AgentScope, the agent behaviors are abstracted into three core functions in
``AgentBase`` class:

- ``reply``: Handle incoming message(s) and generate a response message.
- ``observe``: Receive message(s) from the environment or other agents without returning a response.
- ``print``: Display message(s) to the target terminal, web interface, etc.

To support realtime steering, an additional ``handle_interrupt`` function is
provided to handle user interrupts during the agent's reply process.

Additionally, ReAct agent is the most important agent in AgentScope, where
the agent's reply process is divided into two stages:

- reasoning: thinking and generating tool calls by calling the LLM
- acting: execute the tool functions.

Thus, we provide two additional core functions in ``ReActAgentBase`` class,
``_reasoning`` and ``_acting``.

Formatter
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Formatter is the core component for LLM compatibility in AgentScope,
responsible for converting message objects into the required format for
LLM APIs.

Besides, additional functionality such as prompt engineering, truncation,
and message validation can also be implemented in the formatter.

Within the formatter, the "multi-agent" (or "multi-identity") concept differs
from the common multi-agent orchestration concept.
It focuses on the scenario where multiple identities are involved in the
given messages, so that the common used ``role`` field (usually "role",
"assistant" or "system") in LLM APIs cannot distinguish them.

Therefore, AgentScope provides multi-agent formatter to handle
this scenario, usually used in games, multi-person chats, and social
simulations.

.. note:: Multi-agent workflow **!=** multi-agent in formatter.
 For example, even if the following code snippet may involve multiple
 agents (the ``tool_agent`` and the ``tool_function`` caller), the input query
 is wrapped into a **user** message, so the ``role`` field can still distinguish
 between them.

 .. code-block:: python

    async def tool_function(query: str) -> str:
        \"\"\"Tool function calling another agent\"\"\"
        msg = Msg("user", query, role="user")
        tool_agent = Agent(name="Programmer")
        return await tool_agent(msg)

 Understanding this distinction helps developers better grasp AgentScope's formatter design.


Long-Term Memory
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Although providing different base classes for short- and
long-term memory, there are no strict distinctions between them in AgentScope.

In our view, everything should be **requirement-driven**. As long as your
needs are excellently met, developers can completely use just one powerful
memory system.

For ensuring the flexibility of AgentScope, we provide a two mode long-term
memory system, allowing the agent to manage (record and retrieve) the
long-term memory by its own.
"""



================================================
FILE: docs/tutorial/en/src/quickstart_message.py
================================================
# -*- coding: utf-8 -*-
"""
.. _message:

Create Message
====================

Message is the core concept in AgentScope, used to support multimodal data, tools API, information storage/exchange and prompt construction.

A message consists of four fields:

- ``name``,
- ``role``,
- ``content``, and
- ``metadata``

The types and descriptions of these fields are as follows:

.. list-table:: The fields in a message object
    :header-rows: 1

    * - Field
      - Type
      - Description
    * - name
      - ``str``
      - The name/identity of the message sender
    * - role
      - | ``Literal[``
        |     ``"system",``
        |     ``"assistant",``
        |     ``"user"``
        | ``]``
      - The role of the message sender, which must be one of "system", "assistant", or "user".
    * - content
      - ``str | list[ContentBlock]``
      - The data of the message, which can be a string or a list of blocks.
    * - metadata
      - ``dict[str, JSONSerializableObject] | None``
      - A dict containing additional metadata about the message, usually used for structured output.

.. tip:: - In application with multiple identities, the ``name`` field is used to distinguish between different identities.
 - The ``metadata`` field is recommended for structured output, which won't be included in the prompt construction.

Next, we introduce the supported blocks in the ``content`` field by their corresponding scenarios.
"""

from agentscope.message import (
    Msg,
    Base64Source,
    TextBlock,
    ThinkingBlock,
    ImageBlock,
    AudioBlock,
    VideoBlock,
    ToolUseBlock,
    ToolResultBlock,
)
import json

# %%
# Creating Textual Message
# -----------------------------
# Creating a message object by providing the ``name``, ``role``, and ``content`` fields.
#

msg = Msg(
    name="Jarvis",
    role="assistant",
    content="Hi! How can I help you?",
)

print(f"The name of the sender: {msg.name}")
print(f"The role of the sender: {msg.role}")
print(f"The content of the message: {msg.content}")

# %%
# Creating Multimodal Message
# --------------------------------------
# The message class supports multimodal content by providing different content blocks:
#
# .. list-table:: Multimodal content blocks in AgentScope
#     :header-rows: 1
#
#     * - Class
#       - Description
#       - Example
#     * - TextBlock
#       - Pure text data
#       - .. code-block:: python
#
#             TextBlock(
#                type="text",
#                text="Hello, world!"
#             )
#     * - ImageBlock
#       - The image data
#       - .. code-block:: python
#
#             ImageBlock(
#                type="image",
#                source=URLSource(
#                    type="url",
#                    url="https://example.com/image.jpg"
#                )
#             )
#     * - AudioBlock
#       - The audio data
#       - .. code-block:: python
#
#             AudioBlock(
#                type="audio",
#                source=URLSource(
#                    type="url",
#                    url="https://example.com/audio.mp3"
#                )
#             )
#     * - VideoBlock
#       - The video data
#       - .. code-block:: python
#
#             VideoBlock(
#                type="video",
#                source=URLSource(
#                    type="url",
#                    url="https://example.com/video.mp4"
#                )
#             )
#
# For ``ImageBlock``, ``AudioBlock`` and ``VideoBlock``, you can use either a base64 encoded string as the source:
#

msg = Msg(
    name="Jarvis",
    role="assistant",
    content=[
        TextBlock(
            type="text",
            text="This is a multimodal message with base64 encoded data.",
        ),
        ImageBlock(
            type="image",
            source=Base64Source(
                type="base64",
                media_type="image/jpeg",
                data="/9j/4AAQSkZ...",
            ),
        ),
        AudioBlock(
            type="audio",
            source=Base64Source(
                type="base64",
                media_type="audio/mpeg",
                data="SUQzBAAAAA...",
            ),
        ),
        VideoBlock(
            type="video",
            source=Base64Source(
                type="base64",
                media_type="video/mp4",
                data="AAAAIGZ0eX...",
            ),
        ),
    ],
)

# %%
# Creating Thinking Message
# --------------------------------------
# The ``ThinkingBlock`` is to support reasoning models, containing the thinking process of the model.
#

msg_thinking = Msg(
    name="Jarvis",
    role="assistant",
    content=[
        ThinkingBlock(
            type="thinking",
            thinking="I'm building an example for thinking block in AgentScope.",
        ),
        TextBlock(
            type="text",
            text="This is an example for thinking block.",
        ),
    ],
)

# %%
# .. _tool-block:
#
# Creating Tool Use/Result Message
# --------------------------------------
# The ``ToolUseBlock`` and ``ToolResultBlock`` are to support tools API:
#

msg_tool_call = Msg(
    name="Jarvis",
    role="assistant",
    content=[
        ToolUseBlock(
            type="tool_use",
            id="343",
            name="get_weather",
            input={
                "location": "Beijing",
            },
        ),
    ],
)

msg_tool_res = Msg(
    name="system",
    role="system",
    content=[
        ToolResultBlock(
            type="tool_result",
            id="343",
            name="get_weather",
            output="The weather in Beijing is sunny with a temperature of 25°C.",
        ),
    ],
)


# %%
# .. tip:: Refer to the :ref:`tool` section for more information about tools API in AgentScope.
#
# Serialization and Deserialization
# ------------------------------------------------
# Message object can be serialized and deserialized by ``to_dict`` and ``from_dict`` methods, respectively.

serialized_msg = msg.to_dict()

print(type(serialized_msg))
print(json.dumps(serialized_msg, indent=4))

# %%
# Deserialize a message from a string in JSON format.

new_msg = Msg.from_dict(serialized_msg)

print(type(new_msg))
print(f'The sender of the message: "{new_msg.name}"')
print(f'The role of the sender: "{new_msg.role}"')
print(f'The content of the message: "{json.dumps(new_msg.content, indent=4)}"')

# %%
# Property Functions
# ------------------------------------------------
# To ease the use of message object, AgentScope provides these functions:
#
# .. list-table:: Functions of the message object
#   :header-rows: 1
#
#   * - Function
#     - Parameters
#     - Description
#   * - get_text_content
#     - \-
#     - Gather content from all ``TextBlock`` in to a single string (separated by "\\n").
#   * - get_content_blocks
#     - ``block_type``
#     - Return a list of content blocks of the specified type. If ``block_type`` not provided, return content in blocks format.
#   * - has_content_blocks
#     - ``block_type``
#     - Check whether the message has content blocks of the specified type. The ``str`` content is considered as a ``TextBlock`` type.



================================================
FILE: docs/tutorial/en/src/task_a2a.py
================================================
# -*- coding: utf-8 -*-
"""
.. _a2a:

A2A Agent
============================

A2A (Agent-to-Agent) is an open standard protocol for enabling interoperable communication between different AI agents.

AgentScope provides support for the A2A protocol at two levels: obtaining Agent Card information and connecting to remote agents. The related APIs are as follows:

.. list-table:: A2A Related Classes
    :header-rows: 1

    * - Class
      - Description
    * - ``A2AAgent``
      - Agent class for communicating with remote A2A agents
    * - ``A2AChatFormatter``
      - Formatter for converting between AgentScope messages and A2A message/task formats
    * - ``AgentCardResolverBase``
      - Base class for Agent Card resolvers
    * - ``FileAgentCardResolver``
      - Resolver for loading Agent Cards from local JSON files
    * - ``WellKnownAgentCardResolver``
      - Resolver for fetching Agent Cards from the well-known path of a URL
    * - ``NacosAgentCardResolver``
      - Resolver for fetching Agent Cards from the Nacos Agent Registry

This section demonstrates how to create an ``A2AAgent`` and communicate with remote A2A agents.

.. note:: Note that A2A support is an **experimental feature** and may change in future versions. Due to limitations of the A2A protocol itself, ``A2AAgent`` cannot fully align with local agents like ``ReActAgent``, including:

 - Only supports chatbot scenarios, i.e., only supports conversations between one user and one agent (does not affect handoff/router usage patterns)
 - Does not support real-time interruption during conversations
 - Does not support agentic structured output
 - In the current implementation, messages received by the ``observe`` method are stored locally and sent to the remote agent together when the ``reply`` method is called. Therefore, if several ``observe`` calls are made without a subsequent ``reply`` call, those messages will not be seen by the remote agent


"""

from a2a.types import AgentCard, AgentCapabilities
from v2.nacos import ClientConfig

from agentscope.a2a import WellKnownAgentCardResolver, NacosAgentCardResolver
from agentscope.agent import A2AAgent, UserAgent
from agentscope.message import Msg, TextBlock
from agentscope.tool import ToolResponse

# %%
# Obtaining Agent Cards
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# First, we need to obtain an Agent Card to connect to the corresponding agent. An Agent Card contains information such as the agent's name, description, capabilities, and connection details.
#
# Manually Creating Agent Card
# --------------------------------
#
# If you know all the information of an Agent Card, you can directly create an Agent Card object from `a2a.types.AgentCard`.
#

# Create an Agent Card object
agent_card = AgentCard(
    name="Friday",  # Agent name
    description="A fun chatting companion",  # Agent description
    url="http://localhost:8000",  # Agent's RPC service URL
    version="1.0.0",  # Agent version
    capabilities=AgentCapabilities(  # Agent capability configuration
        push_notifications=False,
        state_transition_history=True,
        streaming=True,
    ),
    default_input_modes=["text/plain"],  # Supported input formats
    default_output_modes=["text/plain"],  # Supported output formats
    skills=[],  # Agent skill list
)

# %%
#
# Fetching from Remote Services
# --------------------------------
# AgentScope also supports fetching from the standard path of remote services (well-known server).
# Here's an example using ``WellKnownAgentCardResolver`` to fetch an Agent Card from the standard path of a remote service:
#


async def agent_card_from_well_known_website() -> AgentCard:
    """Example of fetching an Agent Card from the well-known path of a remote service."""
    # Create an Agent Card resolver
    resolver = WellKnownAgentCardResolver(
        base_url="http://localhost:8000",
    )
    # Fetch and return the Agent Card
    return await resolver.get_agent_card()


# %%
# Loading Agent Cards from Local Files
# --------------------------------
#
# The ``FileAgentCardResolver`` class supports loading Agent Cards from local JSON files, suitable for configuration file management scenarios.
# An example of an Agent Card in JSON format is shown below:
#
# .. code-block:: json
#     :caption: Example Agent Card JSON file content
#
#     {
#         "name": "RemoteAgent",
#         "url": "http://localhost:8000",
#         "description": "Remote A2A Agent",
#         "version": "1.0.0",
#         "capabilities": {},
#         "default_input_modes": ["text/plain"],
#         "default_output_modes": ["text/plain"],
#         "skills": []
#     }
#
# You can easily load this file using ``FileAgentCardResolver``:
#


async def agent_card_from_file() -> AgentCard:
    """Example of loading an Agent Card from a local JSON file."""
    from agentscope.a2a import FileAgentCardResolver

    # Load Agent Card from JSON file
    resolver = FileAgentCardResolver(
        file_path="./agent_card.json",  # JSON file path
    )
    # Fetch and return the Agent Card
    return await resolver.get_agent_card()


# %%
# Fetching Agent Cards from Nacos Registry
# --------------------------------
#
# Nacos is an open-source dynamic service discovery, configuration management, and service management platform. In version 3.1.0, it introduced the Agent Registry feature, supporting distributed registration, discovery, and version management of A2A agents.
#
# .. important:: The prerequisite for using ``NacosAgentCardResolver`` is that the user has deployed a Nacos server version 3.1.0 or higher. For deployment and registration procedures, please refer to the `official documentation <https://nacos.io/docs/latest/quickstart/quick-start>`_.
#


async def agent_card_from_nacos() -> AgentCard:
    """Example of fetching an Agent Card from the Nacos registry."""

    # Create a Nacos Agent Card resolver
    resolver = NacosAgentCardResolver(
        remote_agent_name="my-remote-agent",  # Agent name registered in Nacos
        nacos_client_config=ClientConfig(
            server_addresses="http://localhost:8848",  # Nacos server address
            # Other optional configuration items
        ),
    )
    # Fetch and return the Agent Card
    return await resolver.get_agent_card()


# %%
# Building an A2A Agent
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# The ``A2AAgent`` class provided by AgentScope is used to communicate with remote A2A agents, and its usage is similar to regular agents.

agent = A2AAgent(agent_card=agent_card)

# %%
# Using ``A2AAgent``, developers can build chatbot scenario conversations, or encapsulate it as a tool function to build more complex application scenarios such as handoff/router.
# Currently, the format protocol conversion supported by ``A2AAgent`` is handled by ``agentscope.formatter.A2AChatFormatter``, which supports:
#
# - Converting AgentScope's ``Msg`` messages to A2A protocol's ``Message`` format
# - Converting A2A protocol responses back to AgentScope's ``Msg`` format
# - Converting A2A protocol's ``Task`` responses to AgentScope's ``Msg`` format
# - Supporting multiple content types such as text, images, audio, and video
#


async def a2a_in_chatbot() -> None:
    """Example of chatting using A2AAgent."""

    user = UserAgent("user")

    msg = None
    while True:
        msg = await user(msg)
        if msg.get_text_content() == "exit":
            break
        msg = await agent(msg)


# %%
# Or encapsulate it as a tool function for invocation:


async def create_worker(query: str) -> ToolResponse:
    """Complete a given task through a sub-agent

    Args:
        query (`str`):
            Description of the task to be completed by the sub-agent
    """
    res = await agent(
        Msg("user", query, "user"),
    )
    return ToolResponse(
        content=[
            TextBlock(
                type="text",
                text=res.get_text_content(),
            ),
        ],
    )



================================================
FILE: docs/tutorial/en/src/task_agent.py
================================================
# -*- coding: utf-8 -*-
"""
.. _agent:

Agent
=========================

In this tutorial, we first focus on introducing the ReAct agent in AgentScope,
then we briefly introduce how to customize your own agent from scratch.

ReAct Agent
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In AgentScope, the ``ReActAgent`` class integrates various features into a final implementation, including

.. list-table:: Features of ``ReActAgent``
    :header-rows: 1

    * - Feature
      - Reference
    * - Support realtime steering
      -
    * - Support memory compression
      -
    * - Support parallel tool calls
      -
    * - Support structured output
      -
    * - Support fine-grained MCP control
      - :ref:`mcp`
    * - Support agent-controlled tools management (Meta tool)
      - :ref:`tool`
    * - Support self-controlled long-term memory
      - :ref:`long-term-memory`
    * - Support automatic state management
      - :ref:`state`


Due to limited space, in this tutorial we only demonstrate the first three
features of ``ReActAgent`` class, leaving the others to the corresponding sections
listed above.

"""

import asyncio
import json
import os
from datetime import datetime
import time

from pydantic import BaseModel, Field

from agentscope.agent import ReActAgent
from agentscope.formatter import DashScopeChatFormatter
from agentscope.memory import InMemoryMemory
from agentscope.message import TextBlock, Msg
from agentscope.model import DashScopeChatModel
from agentscope.tool import Toolkit, ToolResponse


# %%
# Realtime Steering
# ---------------------------------------
#
# The realtime steering allows user to interrupt the agent's reply at any time,
# which is implemented based on the asyncio cancellation mechanism.
#
# Specifically, when calling the ``interrupt`` method of the agent, it will
# cancel the current reply task, and execute the ``handle_interrupt`` method
# for postprocessing.
#
# .. hint:: With the feature of supporting streaming tool results in
#  :ref:`tool`, users can interrupt the tool execution if it takes too long or
#  deviates from user expectations by Ctrl+C in the terminal or calling the
#  ``interrupt`` method of the agent in your code.
#
# The interruption logic has been implemented in the ``AgentBase`` class as a
# basic feature, leaving a ``handle_interrupt`` method for users to customize the
# post-processing of interruption as follows:
#
# .. code-block:: python
#
#     # code snippet of AgentBase
#     class AgentBase:
#         ...
#         async def __call__(self, *args: Any, **kwargs: Any) -> Msg:
#             ...
#             reply_msg: Msg | None = None
#             try:
#                 self._reply_task = asyncio.current_task()
#                 reply_msg = await self.reply(*args, **kwargs)
#
#             except asyncio.CancelledError:
#                 # Catch the interruption and handle it by the handle_interrupt method
#                 reply_msg = await self.handle_interrupt(*args, **kwargs)
#
#             ...
#
#         @abstractmethod
#         async def handle_interrupt(self, *args: Any, **kwargs: Any) -> Msg:
#             pass
#
#
# In ``ReActAgent`` class, we return a fixed message "I noticed that you have
# interrupted me. What can I do for you?" as follows:
#
# .. figure:: ../../_static/images/interruption_en.gif
#     :width: 100%
#     :align: center
#     :class: bordered-image
#     :alt: Example of interruption
#
#     Example of interruption
#
# You can override it with your own implementation, for example, calling the LLM
# to generate a simple response to the interruption.
#
#
# Memory Compression
# ----------------------------------------
# As conversations grow longer, the token count in memory can exceed model context
# limits or slow down inference. ``ReActAgent`` provides an automatic memory compression
# feature to address this issue.
#
# **Basic Usage**
#
# To enable memory compression, provide a ``CompressionConfig`` instance when initializing
# the ``ReActAgent``:
#
# .. code-block:: python
#
#     from agentscope.agent import ReActAgent
#     from agentscope.token import CharTokenCounter
#
#     agent = ReActAgent(
#         name="Assistant",
#         sys_prompt="You are a helpful assistant.",
#         model=model,
#         formatter=formatter,
#         compression_config=ReActAgent.CompressionConfig(
#             enable=True,
#             agent_token_counter=CharTokenCounter(),  # The token counter for the agent
#             trigger_threshold=10000,  # Trigger compression when exceeding 10000 tokens
#             keep_recent=3,            # Keep the most recent 3 messages uncompressed
#         ),
#     )
#
# When memory compression is enabled, the agent monitors the token count in its memory.
# Once it exceeds the ``trigger_threshold``, the agent automatically:
#
# 1. Identifies messages that haven't been compressed yet (via ``exclude_mark``)
# 2. Keeps the most recent ``keep_recent`` messages uncompressed (to preserve recent context)
# 3. Sends older messages to an LLM to generate a structured summary
# 4. Marks the compressed messages with ``MemoryMark.COMPRESSED`` (via ``update_messages_mark``)
# 5. Stores the summary in memory (via ``update_compressed_summary``)
#
# .. important:: The compression uses a **marking mechanism** rather than replacing messages. Old messages are marked as compressed and excluded from future retrievals via ``exclude_mark=MemoryMark.COMPRESSED``, while the generated summary is stored separately and retrieved when needed. This approach preserves the original messages and allows flexible memory management. For more details about the mark functionality, please refer to :ref:`memory`.
#
# By default, the compressed summary is structured into five key fields:
#
# - **task_overview**: The user's core request and success criteria
# - **current_state**: What has been completed so far, including files and outputs
# - **important_discoveries**: Technical constraints, decisions, errors, and failed approaches
# - **next_steps**: Specific actions needed to complete the task
# - **context_to_preserve**: User preferences, domain details, and promises made
#
# **Customizing Compression**
#
# You can customize how compression works by specifying ``summary_schema``,
# ``summary_template``, and ``compression_prompt`` parameters.
#
# - **compression_prompt**: Guides the LLM on how to generate the summary
# - **summary_schema**: Defines the structure of the compressed summary using a Pydantic model
# - **summary_template**: Formats how the compressed summary is presented back to the agent
#
# Here's an example of customizing the compression:
#
# .. code-block:: python
#
#     from pydantic import BaseModel, Field
#
#     # Define a custom summary structure
#     class CustomSummary(BaseModel):
#         main_topic: str = Field(
#             max_length=200,
#             description="The main topic of the conversation"
#         )
#         key_points: str = Field(
#             max_length=400,
#             description="Important points discussed"
#         )
#         pending_tasks: str = Field(
#             max_length=200,
#             description="Tasks that remain to be done"
#         )
#
#     # Create agent with custom compression configuration
#     agent = ReActAgent(
#         name="Assistant",
#         sys_prompt="You are a helpful assistant.",
#         model=model,
#         formatter=formatter,
#         compression_config=ReActAgent.CompressionConfig(
#             enable=True,
#             agent_token_counter=CharTokenCounter(),
#             trigger_threshold=10000,
#             keep_recent=3,
#             # Custom schema for structured summary
#             summary_schema=CustomSummary,
#             # Custom prompt to guide compression
#             compression_prompt=(
#                 "<system-hint>Please summarize the above conversation "
#                 "focusing on the main topic, key discussion points, "
#                 "and any pending tasks.</system-hint>"
#             ),
#             # Custom template to format the summary
#             summary_template=(
#                 "<system-info>Conversation Summary:\n"
#                 "Main Topic: {main_topic}\n\n"
#                 "Key Points:\n{key_points}\n\n"
#                 "Pending Tasks:\n{pending_tasks}"
#                 "</system-info>"
#             ),
#         ),
#     )
#
# The ``summary_template`` uses the fields defined in ``summary_schema`` as placeholders
# (e.g., ``{main_topic}``, ``{key_points}``). After the LLM generates the structured summary,
# these placeholders will be replaced with the actual values.
#
# .. note:: The agent ensures that tool use and tool result pairs are kept together during compression to maintain the integrity of the conversation flow.
#
# .. tip:: You can use a smaller, faster model for compression by specifying a different ``compression_model`` and ``compression_formatter`` to reduce costs and latency.
#
#
#
# Parallel Tool Calls
# ----------------------------------------
# ``ReActAgent`` supports parallel tool calls by providing a ``parallel_tool_calls``
# argument in its constructor.
# When multiple tool calls are generated, and ``parallel_tool_calls`` is set to ``True``,
# they will be executed in parallel by the ``asyncio.gather`` function.
#
# .. note:: The parallel tool execution in ``ReActAgent`` is implemented based on ``asyncio.gather``. Therefore, to maximize the effect of parallel tool execution, both the tool function itself and the logic within it must be asynchronous.
#
# .. note:: When running, please ensure that parallel tool calling is supported at the model level and the corresponding parameters are set correctly (can be passed through ``generate_kwargs``). For example, for the DashScope API, you need to set ``parallel_tool_calls`` to ``True``, otherwise parallel tool calling will not be possible.


# prepare a tool function
async def example_tool_function(tag: str) -> ToolResponse:
    """A sample example tool function"""
    start_time = datetime.now().strftime("%H:%M:%S.%f")

    # Sleep for 3 seconds to simulate a long-running task
    await asyncio.sleep(3)

    end_time = datetime.now().strftime("%H:%M:%S.%f")
    return ToolResponse(
        content=[
            TextBlock(
                type="text",
                text=f"Tag {tag} started at {start_time} and ended at {end_time}. ",
            ),
        ],
    )


toolkit = Toolkit()
toolkit.register_tool_function(example_tool_function)

# Create an ReAct agent
agent = ReActAgent(
    name="Jarvis",
    sys_prompt="You're a helpful assistant named Jarvis.",
    model=DashScopeChatModel(
        model_name="qwen-max",
        api_key=os.environ["DASHSCOPE_API_KEY"],
        # Preset the generation kwargs to enable parallel tool calls
        generate_kwargs={
            "parallel_tool_calls": True,
        },
    ),
    memory=InMemoryMemory(),
    formatter=DashScopeChatFormatter(),
    toolkit=toolkit,
    parallel_tool_calls=True,
)


async def example_parallel_tool_calls() -> None:
    """Example of parallel tool calls"""
    # prompt the agent to generate two tool calls at once
    await agent(
        Msg(
            "user",
            "Generate two tool calls of the 'example_tool_function' function with tag as 'tag1' and 'tag2' AT ONCE so that they can execute in parallel.",
            "user",
        ),
    )


asyncio.run(example_parallel_tool_calls())

# %%
# Structured Output
# ----------------------------------------
# To generate a structured output, the ``ReActAgent`` instance receives a child class
# of the ``pydantic.BaseModel`` as the ``structured_model`` argument in its ``__call__`` function.
# Then we can get the structured output from the ``metadata`` field of the returned message.
#
#
# Taking introducing Einstein as an example:
#

# Create an ReAct agent
agent = ReActAgent(
    name="Jarvis",
    sys_prompt="You're a helpful assistant named Jarvis.",
    model=DashScopeChatModel(
        model_name="qwen-max",
        api_key=os.environ["DASHSCOPE_API_KEY"],
        # Preset the generation kwargs to enable parallel tool calls
        generate_kwargs={
            "parallel_tool_calls": True,
        },
    ),
    memory=InMemoryMemory(),
    formatter=DashScopeChatFormatter(),
    toolkit=Toolkit(),
    parallel_tool_calls=True,
)


# The structured model
class Model(BaseModel):
    name: str = Field(description="The name of the person")
    description: str = Field(
        description="A one-sentence description of the person",
    )
    age: int = Field(description="The age")
    honor: list[str] = Field(description="A list of honors of the person")


async def example_structured_output() -> None:
    """The example structured output"""
    res = await agent(
        Msg(
            "user",
            "Introduce Einstein",
            "user",
        ),
        structured_model=Model,
    )
    print("\nThe structured output:")
    print(json.dumps(res.metadata, indent=4))


asyncio.run(example_structured_output())

# %%
# Customizing Agent
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# AgentScope provides two base classes, ``AgentBase`` and ``ReActAgentBase``, which
# differ in the abstract methods they define and the hooks they support.
# Specifically, the ``ReActAgentBase`` extends ``AgentBase`` with additional ``_reasoning`` and ``_acting``
# abstract methods, as well as their pre- and post- hooks.
#
# Developers can choose to inherit from either of these base classes based on their needs.
# We summarize the agent under ``agentscope.agent`` module as follows:
#
# .. list-table:: Agent classes in AgentScope
#     :header-rows: 1
#
#     * - Class
#       - Abstract Method
#       - Support Hooks
#       - Description
#     * - ``AgentBase``
#       - | ``reply``
#         | ``observe``
#         | ``print``
#         | ``handle_interrupt``
#       - | pre\_/post_reply
#         | pre\_/post_observe
#         | pre\_/post_print
#       - The base class for all agents, providing the basic interface and hooks.
#     * - ``ReActAgentBase``
#       - | ``reply``
#         | ``observe``
#         | ``print``
#         | ``handle_interrupt``
#         | ``_reasoning``
#         | ``_acting``
#       - | pre\_/post_reply
#         | pre\_/post_observe
#         | pre\_/post_print
#         | pre\_/post_reasoning
#         | pre\_/post_acting
#       - The abstract class for ReAct agent, extending ``AgentBase`` with reasoning and acting abstract methods and their hooks.
#     * - ``ReActAgent``
#       - \-
#       - | pre\_/post_reply
#         | pre\_/post_observe
#         | pre\_/post_print
#         | pre\_/post_reasoning
#         | pre\_/post_acting
#       - An implementation of ``ReActAgentBase``
#     * - ``UserAgent``
#       -
#       -
#       - A special agent that represents the user, used to interact with the agent
#     * - ``A2aAgent``
#       - \-
#       - | pre\_/post_reply
#         | pre\_/post_observe
#         | pre\_/post_print
#       - Agent for communicating with remote A2A agents, see :ref:`a2a`
#
#
#
# Further Reading
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# - :ref:`tool`
# - :ref:`hook`
# - :ref:`a2a`
#



================================================
FILE: docs/tutorial/en/src/task_agent_skill.py
================================================
# -*- coding: utf-8 -*-
"""
.. _agent_skill:

Agent Skill
============================

`Agent skill <https://claude.com/blog/skills>`_ is an approach proposed by
Anthropic to improve agent capabilities on specific tasks.

AgentScope provides built-in support for Agent Skills through the ``Toolkit``
class, allowing users to easily register and manage agent skills.

The related APIs are as follows:

.. list-table:: Agent skill API in ``Toolkit`` class
    :header-rows: 1

    * - API
      - Description
    * - ``register_agent_skill``
      - Register agent skills from a given directory.
    * - ``remove_agent_skill``
      - Remove a registered agent skill by name.
    * - ``get_agent_skill_prompt``
      - Get the prompt for all registered agent skills, which can be
        attached to the system prompt for the agent.

In this section we demonstrate how to register agent skills and use them in an
ReAct agent.
"""
import os

from agentscope.agent import ReActAgent
from agentscope.formatter import DashScopeChatFormatter
from agentscope.memory import InMemoryMemory
from agentscope.model import DashScopeChatModel
from agentscope.tool import Toolkit

# %%
# Registering Agent Skills
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# First, we need to prepare an agent skill directory, which follows the
# requirements specified in the `Anthropic blog <https://claude.com/blog/skills>`_.
#
# .. note:: The skill directory must contain a ``SKILL.md`` file containing
#  YAML frontmatter and instructions.
#
# Here, we fake an example skill directory ``sample_skill`` with the following files:
#
# .. code-block:: markdown
#
#   ---
#   name: sample_skill
#   description: A sample agent skill for demonstration.
#   ---
#
#   # Sample Skill
#   ...
#

os.makedirs("sample_skill", exist_ok=True)
with open("sample_skill/SKILL.md", "w", encoding="utf-8") as f:
    f.write(
        """---
name: sample_skill
description: A sample agent skill for demonstration.
---

# Sample Skill
...
""",
    )

# %%
# Then, we can register the skill using the ``register_agent_skill`` API of
# the ``Toolkit`` class.
#

toolkit = Toolkit()

toolkit.register_agent_skill("sample_skill")

# %%
# After that, we can get the prompt for all registered agent skills using the
# ``get_agent_skill_prompt`` API

agent_skill_prompt = toolkit.get_agent_skill_prompt()
print("Agent Skill Prompt:")
print(agent_skill_prompt)

# %%
# Of course, we can customize the prompt template when creating the ``Toolkit``
# instance.

toolkit = Toolkit(
    # The instruction that introduces how to use the skill to the agent/llm
    agent_skill_instruction="<system-info>You're provided a collection of skills, each in a directory and described by a SKILL.md file.</system-info>\n",
    # The template for formatting each skill's prompt, must contain
    # {name}, {description}, and {dir} fields
    agent_skill_template="- {name}({dir}): {description}",
)

toolkit.register_agent_skill("sample_skill")
agent_skill_prompt = toolkit.get_agent_skill_prompt()
print("Customized Agent Skill Prompt:")
print(agent_skill_prompt)

# %%
# Integrating Agent Skills with ReActAgent
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# The `ReActAgent` class in AgentScope will attach the agent skill prompt to
# the system prompt automatically.
#
# We can create a ReAct agent with the registered agent skills as follows:
#
# .. important:: When using agent skills, the agent must be equipped with text
#  file reading or shell command tools to access the skill instructions in
#  `SKILL.md` files.
#

agent = ReActAgent(
    name="Friday",
    sys_prompt="You are a helpful assistant named Friday.",
    model=DashScopeChatModel(
        model_name="qwen3-max",
        api_key=os.environ["DASHSCOPE_API_KEY"],
    ),
    memory=InMemoryMemory(),
    formatter=DashScopeChatFormatter(),
    toolkit=toolkit,
)

print("Agent's System Prompt with Agent Skills:")
print(agent.sys_prompt)



================================================
FILE: docs/tutorial/en/src/task_embedding.py
================================================
# -*- coding: utf-8 -*-
"""
.. _embedding:

Embedding
=========================

In AgentScope, the embedding module provides a unified interface for vector representation generation, which features:

- Support **caching embeddings** to avoid redundant API calls
- Support **multiple embedding providers** with a consistent API

AgentScope has built-in embedding classes for the following API providers:

.. list-table::
    :header-rows: 1

    * - Provider
      - Class
    * - OpenAI
      - ``OpenAITextEmbedding``
    * - Gemini
      - ``GeminiTextEmbedding``
    * - DashScope
      - ``DashScopeTextEmbedding``, ``DashScopeMultiModalEmbedding``
    * - Ollama
      - ``OllamaTextEmbedding``

All classes inherit from ``EmbeddingModelBase``, implementing the ``__call__`` method and generating ``EmbeddingResponse`` object with the embeddings and usage information.
The ``DashScopeMultiModalEmbedding`` supports multi-modal embeddings for text, images, and videos.

Taking the DashScope embedding class as an example, you can use it as follows:
"""

import asyncio
import os
import tempfile

from agentscope.embedding import DashScopeTextEmbedding, FileEmbeddingCache


async def example_dashscope_embedding() -> None:
    """Example usage of DashScope text embedding."""
    texts = [
        "What is the capital of France?",
        "Paris is the capital city of France.",
    ]

    # Initialize the DashScope text embedding instance
    embedding_model = DashScopeTextEmbedding(
        model_name="text-embedding-v2",
        api_key=os.getenv("DASHSCOPE_API_KEY"),
    )

    # Get the embedding from the model
    response = await embedding_model(texts)

    print("The embedding ID: ", response.id)
    print("The embedding create at: ", response.created_at)
    print("The embedding usage: ", response.usage)
    print("The embedding:")
    print(response.embeddings)


asyncio.run(example_dashscope_embedding())

# %%
# You can customize your embedding model by subclassing ``EmbeddingModelBase`` and implementing the ``__call__`` method.
#
# Embedding Cache
# ---------------------
# AgentScope provides a base class ``EmbeddingCacheBase`` for caching embeddings, as well as a file-based implementation ``FileEmbeddingCache``.
# It works as follows in the embedding module:
#
# .. image:: ../../_static/images/embedding_cache.png
#   :align: center
#   :width: 90%
#
# To use caching, just pass an instance of ``FileEmbeddingCache`` (or your custom cache) to the embedding model's constructor as follows:
#


async def example_embedding_cache() -> None:
    """Demonstrate embedding with cache functionality."""
    # Example texts
    texts = [
        "What is the capital of France?",
        "Paris is the capital city of France.",
    ]

    # Create a temporary directory for cache demonstration
    # In real applications, you might want to use a persistent directory
    cache_dir = tempfile.mkdtemp(prefix="embedding_cache_")
    print(f"Using cache directory: {cache_dir}")

    # Initialize the embedding model with cache
    # We limit the cache to 100 files and 10MB for demonstration purposes
    embedder = DashScopeTextEmbedding(
        model_name="text-embedding-v3",
        api_key=os.getenv("DASHSCOPE_API_KEY"),
        embedding_cache=FileEmbeddingCache(
            cache_dir=cache_dir,
            max_file_number=100,
            max_cache_size=10,  # Maximum cache size in MB
        ),
    )

    # First call - will fetch from API and store in cache
    print("\n=== First API Call (No Cache Hit) ===")
    start_time = asyncio.get_event_loop().time()
    response1 = await embedder(texts)
    elapsed_time1 = asyncio.get_event_loop().time() - start_time
    print(f"Source: {response1.source}")  # Should be 'api'
    print(f"Time taken: {elapsed_time1:.4f} seconds")
    print(f"Tokens used: {response1.usage.tokens}")

    # Second call with the same texts - should use cache
    print("\n=== Second API Call (Cache Hit Expected) ===")
    start_time = asyncio.get_event_loop().time()
    response2 = await embedder(texts)
    elapsed_time2 = asyncio.get_event_loop().time() - start_time
    print(f"Source: {response2.source}")  # Should be 'cache'
    print(f"Time taken: {elapsed_time2:.4f} seconds")
    print(
        f"Tokens used: {response2.usage.tokens}",
    )  # Should be 0 for cached results
    print(
        f"Speed improvement: {elapsed_time1 / elapsed_time2:.1f}x faster with cache",
    )


asyncio.run(example_embedding_cache())



================================================
FILE: docs/tutorial/en/src/task_eval.py
================================================
# -*- coding: utf-8 -*-
"""
.. _eval:

Evaluation
=========================

AgentScope provides a built-in evaluation framework for assessing agent performance across different tasks and benchmarks, featuring:

- `Ray <https://github.com/ray-project/ray>`_-based parallel and distributed evaluation
- Support continuation after interruption
- 🚧 Visualization of evaluation results

.. note:: We are keeping integrating new benchmarks into AgentScope:

 - ✅ `ACEBench <https://github.com/ACEBench/ACEBench>`_
 - 🚧 `GAIA <https://huggingface.co/datasets/gaia-benchmark/GAIA/tree/main>`_ Benchmark


Overview
---------------------------

The AgentScope evaluation framework consists of several key components:

- **Benchmark**: Collections of tasks for systematic evaluation
    - **Task**: Individual evaluation units with inputs, ground truth, and metrics
        - **Metric**: Measurement functions that assess solution quality
- **Evaluator**: Engine that runs evaluation, aggregates results, and analyzes performance
    - **Evaluator Storage**: Persistent storage for recording and retrieving evaluation results
- **Solution**: The user-defined solution

.. figure:: ../../_static/images/evaluation.png
    :width: 90%
    :alt: AgentScope Evaluation Framework

    *AgentScope Evaluation Framework*

The current implementation in AgentScope includes:

- Evaluator:
    - ``RayEvaluator``: A ray-based evaluator that supports parallel and distributed evaluation.
    - ``GeneralEvaluator``: A general evaluator that runs tasks sequentially, friendly for debugging.
- Benchmark:
    - ``ACEBench``: A benchmark for evaluating agent capabilities.

We have provided a toy example in our `GitHub repository <https://github.com/agentscope-ai/agentscope/tree/main/examples/evaluation/ace_bench>`_ with ``RayEvaluator`` and the agent multistep tasks in ACEBench.

Core Components
---------------
We are going to build a simple toy math question benchmark to demonstrate
how to use the AgentScope evaluation module.
"""

TOY_BENCHMARK = [
    {
        "id": "math_problem_1",
        "question": "What is 2 + 2?",
        "ground_truth": 4.0,
        "tags": {
            "difficulty": "easy",
            "category": "math",
        },
    },
    {
        "id": "math_problem_2",
        "question": "What is 12345 + 54321 + 6789 + 9876?",
        "ground_truth": 83331,
        "tags": {
            "difficulty": "medium",
            "category": "math",
        },
    },
]

# %%
# From Tasks, Solutions and Metrics to Benchmark
# ~~~~~~~~~~~~~~~~~~~
#
# - A ``SolutionOutput`` contains all information generated by the agent, including the trajectory and final output.
# - A ``Metric`` represents a single evaluation callable instance that compares the generated solution (e.g., trajectory or final output) to the ground truth.
# In the toy example, we define a metric that simply checks whether the ``output`` field in the solution matches the ground truth.

from agentscope.evaluate import (
    SolutionOutput,
    MetricBase,
    MetricResult,
    MetricType,
)


class CheckEqual(MetricBase):
    def __init__(
        self,
        ground_truth: float,
    ):
        super().__init__(
            name="math check number equal",
            metric_type=MetricType.NUMERICAL,
            description="Toy metric checking if two numbers are equal",
            categories=[],
        )
        self.ground_truth = ground_truth

    async def __call__(
        self,
        solution: SolutionOutput,
    ) -> MetricResult:
        if solution.output == self.ground_truth:
            return MetricResult(
                name=self.name,
                result=1.0,
                message="Correct",
            )
        else:
            return MetricResult(
                name=self.name,
                result=0.0,
                message="Incorrect",
            )


# %%
# - A ``Task`` is a unit in the benchmark that includes all information for the agent to execute and evaluate (e.g., input/query and its ground truth).
# - A ``Benchmark`` organizes multiple tasks for systematic evaluation.

from typing import Generator
from agentscope.evaluate import (
    Task,
    BenchmarkBase,
)


class ToyBenchmark(BenchmarkBase):
    def __init__(self):
        super().__init__(
            name="Toy bench",
            description="A toy benchmark for demonstrating the evaluation module.",
        )
        self.dataset = self._load_data()

    @staticmethod
    def _load_data() -> list[Task]:
        dataset = []
        for item in TOY_BENCHMARK:
            dataset.append(
                Task(
                    id=item["id"],
                    input=item["question"],
                    ground_truth=item["ground_truth"],
                    tags=item.get("tags", {}),
                    metrics=[
                        CheckEqual(item["ground_truth"]),
                    ],
                    metadata={},
                ),
            )
        return dataset

    def __iter__(self) -> Generator[Task, None, None]:
        """Iterate over the benchmark."""
        for task in self.dataset:
            yield task

    def __getitem__(self, index: int) -> Task:
        """Get a task by index."""
        return self.dataset[index]

    def __len__(self) -> int:
        """Get the length of the benchmark."""
        return len(self.dataset)


# %%
# Evaluators
# ~~~~~~~~~~
#
# Evaluators manage the evaluation process. They can automatically iterate through the
# tasks in the benchmark and feed each task into a solution-generation function,
# where developers need to define the logic for running agents and retrieving
# the execution result and trajectory. Below is an example of
# running ``GeneralEvaluator`` with our toy benchmark. If there is a large
# benchmark and the developer wants to get the evaluation more efficiently
# through parallelization, ``RayEvaluator`` is available as a built-in solution
# as well.


import os
import asyncio
from typing import Callable
from pydantic import BaseModel

from agentscope.message import Msg
from agentscope.model import DashScopeChatModel
from agentscope.formatter import DashScopeChatFormatter
from agentscope.agent import ReActAgent

from agentscope.evaluate import (
    GeneralEvaluator,
    FileEvaluatorStorage,
)


class ToyBenchAnswerFormat(BaseModel):
    answer_as_number: float


async def toy_solution_generation(
    task: Task,
    pre_hook: Callable,
) -> SolutionOutput:
    agent = ReActAgent(
        name="Friday",
        sys_prompt="You are a helpful assistant named Friday. "
        "Your target is to solve the given task with your tools. "
        "Try to solve the task as best as you can.",
        model=DashScopeChatModel(
            api_key=os.environ.get("DASHSCOPE_API_KEY"),
            model_name="qwen-max",
            stream=False,
        ),
        formatter=DashScopeChatFormatter(),
    )
    agent.register_instance_hook(
        "pre_print",
        "save_logging",
        pre_hook,
    )
    msg_input = Msg("user", task.input, role="user")
    res = await agent(
        msg_input,
        structured_model=ToyBenchAnswerFormat,
    )
    return SolutionOutput(
        success=True,
        output=res.metadata.get("answer_as_number", None),
        trajectory=[],
    )


async def main() -> None:
    evaluator = GeneralEvaluator(
        name="Toy benchmark evaluation",
        benchmark=ToyBenchmark(),
        # Repeat how many times
        n_repeat=1,
        storage=FileEvaluatorStorage(
            save_dir="./results",
        ),
        # How many workers to use
        n_workers=1,
    )

    # Run the evaluation
    await evaluator.run(toy_solution_generation)


asyncio.run(main())



================================================
FILE: docs/tutorial/en/src/task_eval_openjudge.py
================================================
# -*- coding: utf-8 -*-
"""
Evaluation with OpenJudge
=========================

This guide introduces how to use [OpenJudge](https://github.com/agentscope-ai/OpenJudge) graders as AgentScope metrics to evaluate your multi-agent applications.
OpenJudge is a comprehensive evaluation system designed to assess the quality of LLM applications. By integrating OpenJudge into AgentScope, you can extend AgentScope's native evaluation capabilities from basic execution checks to deep, semantic quality analysis.


.. note::
   Install dependencies before running:

   .. code-block:: bash

       pip install agentscope py-openjudge


Overview
--------
While AgentScope provides a robust `MetricBase` for defining evaluation logic, implementing complex, semantic-level metrics (like "Hallucination Detection" or "Response Relevance") often requires
significant effort in prompt engineering and pipeline construction.

Integrating OpenJudge brings three dimensions of capability extension to AgentScope:

1.  **Enhance Evaluation Depth:**: Move beyond simple success/failure checks to multi-dimensional assessments (Accuracy, Safety, Tone, etc.).
2.  **Leverage Verified Graders**: Instantly access 50+ pre-built, expert-level graders without writing custom evaluation prompts, see the [OpenJudge documentation](https://agentscope-ai.github.io/OpenJudge/built_in_graders/overview/) for details.
3.  **Closed-loop Iteration**: Seamlessly embed OpenJudge into AgentScope's `Benchmark`, obtaining quantitative scores and qualitative reasoning.


How to Evaluate with OpenJudge
--------------------

We are going to build a simple QA benchmark to demonstrate how to use the AgentScope evaluation module by integrating OpenJudge's graders.
"""

# %%
QA_BENCHMARK_DATASET = [
    {
        "id": "qa_task_1",
        "question": "What are the health benefits of regular exercise?",
        "reference_output": "Regular exercise improves cardiovascular health, strengthens muscles and bones, "
        "helps maintain a healthy weight, and can improve mental health by reducing anxiety and depression.",
        "ground_truth": "Answers should cover physical and mental health benefits",
        "difficulty": "medium",
        "category": "health",
    },
    {
        "id": "qa_task_2",
        "question": "Describe the main causes of climate change.",
        "reference_output": "Climate change is primarily caused by increased concentrations of greenhouse gases "
        "in the atmosphere due to human activities like burning fossil fuels, deforestation, and industrial processes.",
        "ground_truth": "Answers should mention greenhouse gases and human activities",
        "difficulty": "hard",
        "category": "environment",
    },
    {
        "id": "qa_task_3",
        "question": "What is the significance of the Turing Test in AI?",
        "reference_output": "The Turing Test, proposed by Alan Turing, is a measure of a machine's ability to exhibit"
        " intelligent behavior equivalent to, or indistinguishable from, that of a human.",
        "ground_truth": "Should mention Alan Turing, purpose of the test, and its implications for AI",
        "difficulty": "hard",
        "category": "technology",
    },
]


# %% [markdown]
# AgentScope Metric vs. OpenJudge Grader
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# To make OpenJudge compatible with AgentScope, we need an adapter that inherits from
# AgentScope's ``MetricBase`` and acts as a bridge to OpenJudge's ``BaseGrader``.
#
# * **AgentScope Metric**: A generic unit of evaluation that accepts a ``SolutionOutput`` and returns a ``MetricResult``.
# * **OpenJudge Grader**: A specialized evaluation unit (e.g., ``RelevanceGrader``) that requires specific, semantic inputs (like ``query``, ``response``, ``context``), and returns a ``GraderResult``.
#
# This "Adapter" allows you to plug *any* OpenJudge grader into your AgentScope benchmark seamlessly.
#

# %%
from openjudge.graders.base_grader import BaseGrader
from openjudge.graders.schema import GraderScore, GraderError
from openjudge.utils.mapping import parse_data_with_mapper
from agentscope.evaluate import (
    MetricBase,
    MetricType,
    MetricResult,
    SolutionOutput,
)


class OpenJudgeMetric(MetricBase):
    """
    A wrapper that converts an OpenJudge grader into an AgentScope Metric.
    """

    def __init__(
        self,
        grader_cls: type[BaseGrader],
        data: dict,
        mapper: dict,
        name: str | None = None,
        description: str | None = None,
        **grader_kwargs,
    ):
        # Initialize the OpenJudge grader
        self.grader = grader_cls(**grader_kwargs)

        super().__init__(
            name=name or self.grader.name,
            metric_type=MetricType.NUMERICAL,
            description=description or self.grader.description,
        )

        self.data = data
        self.mapper = mapper

    async def __call__(self, solution: SolutionOutput) -> MetricResult:
        """Execute the wrapped OpenJudge grader against the agent solution."""
        if not solution.success:
            return MetricResult(
                name=self.name,
                result=0.0,
                message="Solution failed",
            )

        try:
            # 1. Context Construction
            # Combine Static Task Context (item) and Dynamic Agent Output (solution)
            combined_data = {
                "data": self.data,
                "solution": {
                    "output": solution.output,
                    "meta": solution.meta,
                    "trajectory": getattr(solution, "trajectory", []),
                },
            }

            # 2. Data Mapping
            # Use the mapper to extract 'query', 'response', 'context' from the combined data
            grader_inputs = parse_data_with_mapper(
                combined_data,
                self.mapper,
            )

            # 3. Evaluation Execution
            result = await self.grader.aevaluate(**grader_inputs)

            # 4. Result Formatting
            if isinstance(result, GraderScore):
                return MetricResult(
                    name=self.name,
                    result=result.score,
                    # We preserve the detailed reasoning provided by OpenJudge
                    message=result.reason or "",
                )
            elif isinstance(result, GraderError):
                return MetricResult(
                    name=self.name,
                    result=0.0,
                    message=f"Error: {result.error}",
                )
            else:
                return MetricResult(
                    name=self.name,
                    result=0.0,
                    message="Unknown result type",
                )

        except Exception as e:
            return MetricResult(
                name=self.name,
                result=0.0,
                message=f"Exception: {str(e)}",
            )


# %% [markdown]
# From OpenJudge's Graders to AgentScope's Benchmark
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# OpenJudge provides a rich collection of built-in graders. In this example, we select two
# common graders suitable for Question-Answering tasks:
#
# * **RelevanceGrader**: Evaluates whether the agent's response directly addresses the user's query.
# * **CorrectnessGrader**: Verifies the factual accuracy of the response against a provided ground truth.
#
# .. tip::
#    OpenJudge offers 50+ built-in graders covering diverse dimensions like **Hallucination**, **Safety**, **Code Quality**,
#    and **JSON Formatting**. Please refer to the `OpenJudge Documentation <https://agentscope-ai.github.io/OpenJudge/built_in_graders/overview/>`_
#    for the full list of available graders.
#
# .. note::
#    Ensure you have set your ``DASHSCOPE_API_KEY`` environment variable before running the example below.

# %%
import os
from typing import Generator
from openjudge.graders.common.relevance import RelevanceGrader
from openjudge.graders.common.correctness import CorrectnessGrader
from agentscope.evaluate import (
    Task,
    BenchmarkBase,
)


class QABenchmark(BenchmarkBase):
    """A benchmark for QA tasks using OpenJudge metrics."""

    def __init__(self):
        super().__init__(
            name="QA Quality Benchmark",
            description="Benchmark to evaluate QA systems using OpenJudge grader classes",
        )
        self.dataset = self._load_data()

    def _load_data(self):
        tasks = []
        # Configuration for LLM-based graders
        # Ensure OPENAI_API_KEY is set in your environment variables
        model_config = {
            "model": "qwen3-32b",
            "api_key": os.environ.get("DASHSCOPE_API_KEY"),
            "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        }

        for data in QA_BENCHMARK_DATASET:
            # Define the Mapping: Left is OpenJudge key, Right is AgentScope path
            mapper = {
                "query": "data.input",
                "response": "solution.output",
                "context": "data.ground_truth",
                "reference_response": "data.reference_output",
            }

            # Instantiate Metrics via Wrapper
            metrics = [
                OpenJudgeMetric(
                    grader_cls=RelevanceGrader,
                    data=data,
                    mapper=mapper,
                    name="Relevance",
                    model=model_config,
                ),
                OpenJudgeMetric(
                    grader_cls=CorrectnessGrader,
                    data=data,
                    mapper=mapper,
                    name="Correctness",
                    model=model_config,
                ),
            ]

            # Create Task
            task = Task(
                id=data["id"],
                input=data["question"],
                ground_truth=data["ground_truth"],
                metrics=metrics,
            )

            tasks.append(task)

        return tasks

    def __iter__(self) -> Generator[Task, None, None]:
        """Iterate over the benchmark."""
        yield from self.dataset

    def __getitem__(self, index: int) -> Task:
        """Get a task by index."""
        return self.dataset[index]

    def __len__(self) -> int:
        """Get the length of the benchmark."""
        return len(self.dataset)


# %% [markdown]
# Run Evaluation
# ~~~~~~~~~~
# Finally, use AgentScope's ``GeneralEvaluator`` to run the benchmark on a QA agent.
# The results will include both the **Quantitative Score** and the **Qualitative Reasoning**
# from the OpenJudge graders.

# %%

from typing import Callable

from agentscope.agent import ReActAgent
from agentscope.evaluate import GeneralEvaluator
from agentscope.evaluate import FileEvaluatorStorage
from agentscope.formatter import DashScopeChatFormatter
from agentscope.message import Msg
from agentscope.model import OpenAIChatModel


async def qa_agent(task: Task, pre_hook: Callable) -> SolutionOutput:
    """Solution function that generates answers to QA tasks."""

    model = OpenAIChatModel(
        model_name="qwen3-32b",
        api_key=os.getenv("DASHSCOPE_API_KEY"),
    )

    # Create a QA agent
    agent = ReActAgent(
        name="QAAgent",
        sys_prompt="You are an expert at answering questions. Provide clear, accurate, and comprehensive answers.",
        model=model,
        formatter=DashScopeChatFormatter(),
    )

    # Generate response
    msg_input = Msg(name="User", content=task.input, role="user")
    response = await agent(msg_input)
    response_text = response.content

    return SolutionOutput(
        success=True,
        output=response_text,
        trajectory=[
            task.input,
            response_text,
        ],  # Store the interaction trajectory
    )


async def main() -> None:
    evaluator = GeneralEvaluator(
        name="OpenJudge Integration Demo",
        benchmark=QABenchmark(),
        # Repeat how many times
        n_repeat=1,
        storage=FileEvaluatorStorage(
            save_dir="./results",
        ),
        # How many workers to use
        n_workers=1,
    )

    await evaluator.run(qa_agent)



================================================
FILE: docs/tutorial/en/src/task_hook.py
================================================
# -*- coding: utf-8 -*-
"""
.. _hook:

Agent Hooks
===========================

Hooks are extension points in AgentScope that allow developers to customize agent behaviors at specific execution points, providing a flexible way to modify or extend the agent's functionality without changing its core implementation.

In AgentScope, hooks are implemented around the agent's core functions:


.. list-table:: Supported hook types in AgentScope
    :header-rows: 1

    * - Agent Class
      - Core Function
      - Hook Types
      - Description
    * - | ``AgentBase`` &
        | its child classes
      - ``reply``
      - | ``pre_reply``
        | ``post_reply``
      - The hooks before/after agent replying to a message
    * -
      - ``print``
      - | ``pre_print``
        | ``post_print``
      - The hook before/after printing a message to the target output (e.g., terminal, web interface)
    * -
      - ``observe``
      - | ``pre_observe``
        | ``post_observe``
      - The hooks before/after observing a message from the environment or other agents
    * - | ``ReActAgentBase`` &
        | its child classes
      - | ``reply``
        | ``print``
        | ``observe``
      - | ``pre_reply``
        | ``post_reply``
        | ``pre_print``
        | ``post_print``
        | ``pre_observe``
        | ``post_observe``
      -
    * -
      - ``_reasoning``
      - | ``pre_reasoning``
        | ``post_reasoning``
      - The hooks before/after the agent's reasoning process
    * -
      - ``_acting``
      - | ``pre_acting``
        | ``post_acting``
      - The hooks before/after the agent's acting process

.. tip:: Since hooks in AgentScope are implemented using a metaclass, they support inheritance.

To simplify the usage, AgentScope provides unified signatures for all hooks.

"""
import asyncio
from typing import Any, Type

from agentscope.agent import ReActAgentBase, AgentBase
from agentscope.message import Msg


# %%
# Hook Signature
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# AgentScope provides unified hook signatures for all pre- and post-hooks as follows:
#
# **Pre-Hook Signature**
#
# .. list-table:: The signature of all pre-hooks
#   :header-rows: 1
#
#   * -
#     - Name
#     - Description
#   * - Arguments
#     - ``self: AgentBase | ReActAgentBase``
#     - The agent instance
#   * -
#     - ``kwargs: dict[str, Any]``
#     - | The input arguments of the target
#       | function, or the modified arguments
#       | from the most recent non-None return
#       | value of previous hooks
#   * - Returns
#     - ``dict[str, Any] | None``
#     - The modified arguments or None
#
# .. note:: All positional arguments and keyword arguments of the core function are passed as a single ``kwargs`` dict to the hook functions
#
# A pre-hook template is defined as follows:
#


def pre_hook_template(
    self: AgentBase | ReActAgentBase,
    kwargs: dict[str, Any],
) -> dict[str, Any] | None:  # The modified displayed message
    """Pre hook template."""
    pass


# %%
# **Post-Hook Signature**
#
# For post hooks, an additional ``output`` argument is added to the signature, which represents the output of the target function.
# If the core function has no output, the ``output`` argument will be ``None``.
#
# .. list-table:: The signature of all post-hooks
#   :header-rows: 1
#
#   * -
#     - Name
#     - Description
#   * - Arguments
#     - ``self: AgentBase | ReActAgentBase``
#     - The agent instance
#   * -
#     - ``kwargs: dict[str, Any]``
#     - | A dict that contains all the arguments
#       | of the target function
#   * -
#     - ``output: Any``
#     - | The output of the target function or
#       | the most recent non-None return value
#       | from previous hooks
#   * - Returns
#     - ``dict[str, Any] | None``
#     - The modified arguments or None
#


def post_hook_template(
    self: AgentBase | ReActAgentBase,
    kwargs: dict[str, Any],
    output: Any,  # The output of the target function
) -> Any:  # The modified output
    """Post hook template."""
    pass


# %%
# Hook Management
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# AgentScope provides both instance- and class-level hooks, depending on the effective scope of the hooks.
# They execute in the following order:
#
# .. image:: ../../_static/images/sequential_hook.png
#   :width: 90%
#   :align: center
#   :alt: Hooks in AgentScope
#   :class: bordered-image
#
# AgentScope provides built-in methods to manage hooks at both instance and class levels as follows:
#
# .. list-table:: Hook management methods in AgentScope
#   :header-rows: 1
#
#   * - Level
#     - Method
#     - Description
#   * - Instance-level
#     - ``register_instance_hook``
#     - | Register a hook for the current object with
#       | given hook type and name.
#   * -
#     - ``remove_instance_hook``
#     - | Remove a hook for the current object with
#       | given hook type and name.
#   * -
#     - ``clear_instance_hooks``
#     - | Clear all hooks for the current object with
#       | given hook type.
#   * - Class-level
#     - ``register_class_hook``
#     - | Register a hook for all objects of the class
#       | with given hook type and name.
#   * -
#     - ``remove_class_hook``
#     - | Remove a hook for all objects of the class
#       | with given hook type and name.
#   * -
#     - ``clear_class_hooks``
#     - | Clear all hooks for all objects of the
#       | class with given hook type.
#
# When using hooks, you MUST follow these rules:
#
# .. important:: **Execution Order**
#
#  - Hooks are executed in registration order
#  - Multiple hooks can be chained together
#  **Return Value Handling**
#
#  - For pre-hooks: Non-None return values are passed to the next hook or core function
#   - When a hook returns None, the next hook will use the most recent non-None return value from previous hooks
#   - If all previous hooks return None, the next hook receives a copy of the original arguments
#   - The final non-None return value (or original arguments if all hooks return None) is passed to the core function
#  - For post-hooks: Works the same way as pre-hooks.
#  **Important**: Never call the core function (reply/speak/observe/_reasoning/_acting) within a hook to avoid infinite loops
#
# Taking the following agent as an example, we can see how to register, remove and clear hooks:
#


# Create a simple test agent class
class TestAgent(AgentBase):
    """A test agent for demonstrating hooks."""

    async def reply(self, msg: Msg) -> Msg:
        """Reply to the message."""
        return msg


# %%
# We create an instance-level hook and a class-level hook to modify the message content before replying.
#


# Create two pre-reply hooks
def instance_pre_reply_hook(
    self: AgentBase,
    kwargs: dict[str, Any],
) -> dict[str, Any]:
    """A pre-reply hook that modifies the message content."""
    msg = kwargs["msg"]
    msg.content += "[instance-pre-reply]"
    # return modified kwargs
    return {
        **kwargs,
        "msg": msg,
    }


def cls_pre_reply_hook(
    self: AgentBase,
    kwargs: dict[str, Any],
) -> dict[str, Any]:
    """A pre-reply hook that modifies the message content."""
    msg = kwargs["msg"]
    msg.content += "[cls-pre-reply]"
    # return modified kwargs
    return {
        **kwargs,
        "msg": msg,
    }


# Register class hook
TestAgent.register_class_hook(
    hook_type="pre_reply",
    hook_name="test_pre_reply",
    hook=cls_pre_reply_hook,
)

# Register instance hook
agent = TestAgent()
agent.register_instance_hook(
    hook_type="pre_reply",
    hook_name="test_pre_reply",
    hook=instance_pre_reply_hook,
)


async def example_test_hook() -> None:
    """An example function to test the hooks."""
    msg = Msg(
        name="user",
        content="Hello, world!",
        role="user",
    )
    res = await agent(msg)
    print("Response content:", res.content)
    TestAgent.clear_class_hooks()


asyncio.run(example_test_hook())

# %%
# We can see that a "[instance-pre-reply]" and a "[cls-pre-reply]" are added to the message content.
#



================================================
FILE: docs/tutorial/en/src/task_long_term_memory.py
================================================
# -*- coding: utf-8 -*-
"""
.. _long-term-memory:

Long-Term Memory
========================

In AgentScope, we provide a basic class for long-term memory (``LongTermMemoryBase``) and an implementation based on the `mem0 <https://github.com/mem0ai/mem0>`_ library (``Mem0LongTermMemory``).
Together with the design of ``ReActAgent`` class in :ref:`agent` section, we provide two long-term memory modes:

- ``agent_control``: the agent autonomously manages long-term memory by tool calls, and
- ``static_control``: the developer explicitly controls long-term memory operations.

Developers can also use the ``both`` mode, which activates both memory management modes.

.. hint:: These memory modes are suitable for different usage scenarios. Developers can choose the appropriate mode based on their needs.

Using mem0 Long-Term Memory
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. note:: We provide an example of using mem0 long-term memory in the GitHub repository under the ``examples/long_term_memory/mem0`` directory.

"""

import os
import asyncio

from agentscope.message import Msg
from agentscope.memory import InMemoryMemory
from agentscope.agent import ReActAgent
from agentscope.formatter import DashScopeChatFormatter
from agentscope.model import DashScopeChatModel
from agentscope.tool import Toolkit


# Create mem0 long-term memory instance
from agentscope.memory import Mem0LongTermMemory
from agentscope.embedding import DashScopeTextEmbedding


long_term_memory = Mem0LongTermMemory(
    agent_name="Friday",
    user_name="user_123",
    model=DashScopeChatModel(
        model_name="qwen-max-latest",
        api_key=os.environ.get("DASHSCOPE_API_KEY"),
        stream=False,
    ),
    embedding_model=DashScopeTextEmbedding(
        model_name="text-embedding-v2",
        api_key=os.environ.get("DASHSCOPE_API_KEY"),
    ),
    on_disk=False,
)

# %%
# The ``Mem0LongTermMemory`` class provides two main methods for long-term memory operations:
# ``record`` and ``retrieve``.
# They take a list of messages as input and record/retrieve information from long-term memory.
#
# As an example, we first store a user preference and then retrieve related information from long-term memory.
#


# Basic usage example
async def basic_usage():
    """Basic usage example"""
    # Record memory
    await long_term_memory.record(
        [Msg("user", "I like staying in homestays", "user")],
    )

    # Retrieve memory
    results = await long_term_memory.retrieve(
        [Msg("user", "My accommodation preferences", "user")],
    )
    print(f"Retrieval results: {results}")


asyncio.run(basic_usage())

# %%
# Integration with ReAct Agent
# ----------------------------------------
# In AgentScope, the ``ReActAgent`` class receives a ``long_term_memory``
# parameter in its constructor, as well as a ``long_term_memory_mode`` parameter
# that specifies the long-term memory mode.
#
# If ``long_term_memory_mode`` is set to ``agent_control`` or ``both``, two
# tool functions ``record_to_memory`` and ``retrieve_from_memory`` will be
# registered in the agent's toolkit, allowing the agent to autonomously
# manage long-term memory through tool calls.
#
# .. note:: To achieve the best results, the ``"agent_control"`` mode may require
#  additional instructions in the system prompt.
#

# Create ReAct agent with long-term memory
agent = ReActAgent(
    name="Friday",
    sys_prompt="You are an assistant with long-term memory capabilities.",
    model=DashScopeChatModel(
        api_key=os.environ.get("DASHSCOPE_API_KEY"),
        model_name="qwen-max-latest",
    ),
    formatter=DashScopeChatFormatter(),
    toolkit=Toolkit(),
    memory=InMemoryMemory(),
    long_term_memory=long_term_memory,
    long_term_memory_mode="static_control",  # Use static_control mode
)


async def record_preferences():
    """ReAct agent integration example"""
    # Conversation example
    msg = Msg(
        "user",
        "When I travel to Hangzhou, I like staying in homestays",
        "user",
    )
    await agent(msg)


asyncio.run(record_preferences())

# %%
# Then we clear the short-term memory and ask the agent about the user's preferences.
#


async def retrieve_preferences():
    """Retrieve user preferences from long-term memory"""
    # Clear short-term memory
    await agent.memory.clear()
    # The agent will remember previous conversations
    msg2 = Msg("user", "What are my preferences? Answer briefly.", "user")
    await agent(msg2)


asyncio.run(retrieve_preferences())


# %%
# Using ReMe Long-Term Memory
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# .. note:: We provide an example of using ReMe long-term memory in the GitHub repository under the ``examples/long_term_memory/reme`` directory.
#
# .. code-block:: python
#     :caption: Example of ReMe long-term memory setup
#
#     from agentscope.memory import ReMePersonalLongTermMemory
#
#     # Create ReMe personal long-term memory instance
#     reme_long_term_memory = ReMePersonalLongTermMemory(
#         agent_name="Friday",
#         user_name="user_123",
#         model=DashScopeChatModel(
#             model_name="qwen3-max",
#             api_key=os.environ.get("DASHSCOPE_API_KEY"),
#             stream=False,
#         ),
#         embedding_model=DashScopeTextEmbedding(
#             model_name="text-embedding-v4",
#             api_key=os.environ.get("DASHSCOPE_API_KEY"),
#             dimensions=1024,
#         ),
#     )
#
#
# The ``ReMePersonalLongTermMemory`` class provides four main methods for long-term memory operations.
# They include ``record_to_memory`` and ``retrieve_from_memory`` for tool calls,
# as well as ``record`` and ``retrieve`` for direct calls.
#
# As an example, we use ``record_to_memory`` to record user preferences.
#
# .. code-block:: python
#     :caption: Example of recording to ReMe long-term memory
#
#     async def test_record_to_memory():
#         """Test record_to_memory tool function interface"""
#         async with reme_long_term_memory:
#             result = await reme_long_term_memory.record_to_memory(
#                 thinking="The user is sharing their travel preferences and habits",
#                 content=[
#                     "I prefer to stay in homestays when traveling to Hangzhou",
#                     "I like to visit the West Lake in the morning",
#                     "I enjoy drinking Longjing tea",
#                 ],
#             )
#             # Extract result text
#             result_text = " ".join(
#                 block.get("text", "")
#                 for block in result.content
#                 if block.get("type") == "text"
#             )
#             print(f"Recording result: {result_text}")
#
#
#
# Then we use ``retrieve_from_memory`` to retrieve related memories.
#
# .. code-block:: python
#     :caption: Example of retrieving from ReMe long-term memory
#
#     async def test_retrieve_from_memory():
#         """Test retrieve_from_memory tool function interface"""
#         async with reme_long_term_memory:
#             # First record some content
#             await reme_long_term_memory.record_to_memory(
#                 thinking="User is sharing travel preferences",
#                 content=[
#                     "I prefer to stay in homestays when traveling to Hangzhou",
#                 ],
#             )
#
#             # Then retrieve
#             result = await reme_long_term_memory.retrieve_from_memory(
#                 keywords=["Hangzhou travel", "tea preference"],
#             )
#             retrieved_text = " ".join(
#                 block.get("text", "")
#                 for block in result.content
#                 if block.get("type") == "text"
#             )
#             print(f"Retrieved memories: {retrieved_text}")
#
#
# Besides the tool function interface, we can also use the ``record`` method to directly record message conversations.
#
# .. code-block:: python
#     :caption: Example of direct recording to ReMe long-term memory
#
#     async def test_record_direct():
#         """Test record direct recording method"""
#         async with reme_long_term_memory:
#             await reme_long_term_memory.record(
#                 msgs=[
#                     Msg(
#                         role="user",
#                         content="I work as a software engineer and prefer remote work",
#                         name="user",
#                     ),
#                     Msg(
#                         role="assistant",
#                         content="Understood! You're a software engineer who values remote work flexibility.",
#                         name="assistant",
#                     ),
#                     Msg(
#                         role="user",
#                         content="I usually start my day at 9 AM with a cup of coffee",
#                         name="user",
#                     ),
#                 ],
#             )
#             print("Successfully recorded conversation messages")
#
#
# Similarly, we use the ``retrieve`` method to retrieve related memories.
#
# .. code-block:: python
#     :caption: Example of direct retrieval from ReMe long-term memory
#
#     async def test_retrieve_direct():
#         """Test retrieve direct retrieval method"""
#         async with reme_long_term_memory:
#             # First record some content
#             await reme_long_term_memory.record(
#                 msgs=[
#                     Msg(
#                         role="user",
#                         content="I work as a software engineer and prefer remote work",
#                         name="user",
#                     ),
#                 ],
#             )
#
#             # Then retrieve
#             memories = await reme_long_term_memory.retrieve(
#                 msg=Msg(
#                     role="user",
#                     content="What do you know about my work preferences?",
#                     name="user",
#                 ),
#             )
#             print(
#                 f"Retrieved memories: {memories if memories else 'No memories found'}",
#             )
#
#
# Integration with ReAct Agent
# ----------------------------------------
# In AgentScope, the ``ReActAgent`` class receives a ``long_term_memory``
# parameter in its constructor, as well as a ``long_term_memory_mode`` parameter.
#
# If ``long_term_memory_mode`` is set to ``agent_control`` or ``both``,
# ``record_to_memory`` and ``retrieve_from_memory`` tool functions will be
# registered, allowing the agent to autonomously manage long-term memory through tool calls.
#
# .. note:: To achieve the best results, the ``"agent_control"`` mode may require
#  additional instructions in the system prompt.
#
# .. code-block:: python
#     :caption: Example of ReAct agent with ReMe long-term memory
#
#     # Create ReAct agent with long-term memory (agent_control mode)
#     async def test_react_agent_with_reme():
#         """Test ReActAgent integration with ReMe personal memory"""
#         async with reme_long_term_memory:
#             agent_with_reme = ReActAgent(
#                 name="Friday",
#                 sys_prompt=(
#                     "You are a helpful assistant named Friday with long-term memory capabilities. "
#                     "\n\n## Memory Management Guidelines:\n"
#                     "1. **Recording Memories**: When users share personal information, preferences, "
#                     "habits, or facts about themselves, ALWAYS record them using `record_to_memory` "
#                     "for future reference.\n"
#                     "\n2. **Retrieving Memories**: BEFORE answering questions about the user's preferences, "
#                     "past information, or personal details, you MUST FIRST call `retrieve_from_memory` "
#                     "to check if you have any relevant stored information. Do NOT rely solely on the "
#                     "current conversation context.\n"
#                     "\n3. **When to Retrieve**: Call `retrieve_from_memory` when:\n"
#                     "   - User asks questions like 'what do I like?', 'what are my preferences?', "
#                     "'what do you know about me?'\n"
#                     "   - User asks about their past behaviors, habits, or preferences\n"
#                     "   - User refers to information they mentioned before\n"
#                     "   - You need context about the user to provide personalized responses\n"
#                     "\nAlways check your memory first before claiming you don't know something about the user."
#                 ),
#                 model=DashScopeChatModel(
#                     model_name="qwen3-max",
#                     api_key=os.environ.get("DASHSCOPE_API_KEY"),
#                     stream=False,
#                 ),
#                 formatter=DashScopeChatFormatter(),
#                 toolkit=Toolkit(),
#                 memory=InMemoryMemory(),
#                 long_term_memory=reme_long_term_memory,
#                 long_term_memory_mode="agent_control",  # Use agent_control mode
#             )
#
#             # User shares preferences
#             msg = Msg(
#                 role="user",
#                 content="When I travel to Hangzhou, I prefer to stay in a homestay",
#                 name="user",
#             )
#             response = await agent_with_reme(msg)
#             print(f"Agent response: {response.get_text_content()}")
#
#             # Clear short-term memory to test long-term memory
#             await agent_with_reme.memory.clear()
#
#             # Query preferences
#             msg2 = Msg(
#                 role="user",
#                 content="what preference do I have?",
#                 name="user",
#             )
#             response2 = await agent_with_reme(msg2)
#             print(f"Agent response: {response2.get_text_content()}")
#
#
# Then we clear the short-term memory and ask the agent about the user's preferences.
#
# .. code-block:: python
#     :caption: Example of retrieving preferences with ReAct agent and ReMe long-term memory
#
#     async def retrieve_reme_preferences():
#         """Retrieve user preferences from long-term memory"""
#         async with reme_long_term_memory:
#             # Create agent (reusing for demonstration completeness)
#             agent_with_reme = ReActAgent(
#                 name="Friday",
#                 sys_prompt="You are an assistant with long-term memory capabilities.",
#                 model=DashScopeChatModel(
#                     api_key=os.environ.get("DASHSCOPE_API_KEY"),
#                     model_name="qwen3-max",
#                     stream=False,
#                 ),
#                 formatter=DashScopeChatFormatter(),
#                 toolkit=Toolkit(),
#                 memory=InMemoryMemory(),
#                 long_term_memory=reme_long_term_memory,
#                 long_term_memory_mode="agent_control",
#             )
#
#             # Clear short-term memory
#             await agent_with_reme.memory.clear()
#             # The agent will remember previous conversations
#             msg2 = Msg("user", "What are my preferences? Answer briefly.", "user")
#             await agent_with_reme(msg2)
#
# Customizing Long-Term Memory
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# AgentScope provides the ``LongTermMemoryBase`` base class, which defines the basic
#
# Developers can inherit from ``LongTermMemoryBase`` to implement custom long-term
# memory systems according to their needs：
#
# .. list-table:: Long-term memory classes in AgentScope
#     :header-rows: 1
#
#     * - Class
#       - Abstract Methods
#       - Description
#     * - ``LongTermMemoryBase``
#       - | ``record``
#         | ``retrieve``
#         | ``record_to_memory``
#         | ``retrieve_from_memory``
#       - - For ``"static_control"`` mode, you must implement the ``record`` and ``retrieve`` methods.
#         - For ``"agent_control"`` mode, the ``record_to_memory`` and ``retrieve_from_memory`` methods must be implemented.
#     * - ``Mem0LongTermMemory``
#       - | ``record``
#         | ``retrieve``
#         | ``record_to_memory``
#         | ``retrieve_from_memory``
#       - Long-term memory implementation based on the mem0 library, supporting vector storage and retrieval.
#     * - ``ReMePersonalLongTermMemory``
#       - | ``record``
#         | ``retrieve``
#         | ``record_to_memory``
#         | ``retrieve_from_memory``
#       - Personal memory implementation based on the ReMe framework, providing powerful memory management and retrieval capabilities.
#
#
#
#
# Further Reading
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# - :ref:`memory` - Basic memory system
# - :ref:`agent` - ReAct agent
# - :ref:`tool` - Tool system



================================================
FILE: docs/tutorial/en/src/task_mcp.py
================================================
# -*- coding: utf-8 -*-
"""
.. _mcp:

MCP
=========================

The tutorial covers the following features of AgentScope in support of the MCP (Model Context Protocol):

- Support both **HTTP** (streamable HTTP and SSE) and **StdIO** MCP servers
- Provide both **stateful** and **stateless** MCP clients
- Provide both **server-level** and **function-level** MCP tool management

Here the stateful/stateless distinction refers to whether the client maintains a persistent session with the MCP server or not.
The table below summarizes the supported MCP client types and protocols:

.. list-table:: Supported MCP client types and protocols
    :header-rows: 1

    * - Client Type
      - HTTP (Streamable HTTP and SSE)
      - StdIO
    * - Stateful Client
      - ``HttpStatefulClient``
      - ``HttpStatelessClient``
    * - Stateless Client
      - ``StdIOStatefulClient``
      -

"""
import asyncio
import json
import os

from agentscope.mcp import HttpStatefulClient, HttpStatelessClient
from agentscope.tool import Toolkit

# %%
# MCP Client
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# In AgentScope, MCP clients are responsible for
#
# - connecting to the MCP server,
# - obtaining tool functions from the server, and
# - calling tool functions in the MCP server.
#
# There are two types of MCP clients in AgentScope: **Stateful** and **Stateless**.
# They only differ in how to manage the session with the MCP server.
#
# - Stateful Client: The stateful MCP client **maintains a persistent session** with the MCP server within its lifetime. The developers should explicitly call ``connect()`` and ``close()`` methods to manage the connection lifecycle.
# - Stateless Client: The stateless MCP client creates a new session when calling the tool function, and destroys the session right after the tool function call, which is much more lightweight.
#
# .. note:: - The StdIO MCP server only has stateful client, when ``connect()`` is called, it will start the MCP server locally and then connect to it.
#  - For stateful clients, developers must ensure the client is connected when calling the tool functions.
#  - When multiple `HttpStatefulClients` or `StdIOStatefulClients` are connected, they should be closed in Last In First Out (LIFO) order to prevent errors.
#
# Taking Gaode map MCP server as an example, the creation of stateful and stateless clients are very similar:
#

stateful_client = HttpStatefulClient(
    # The name to identify the MCP
    name="mcp_services_stateful",
    transport="streamable_http",
    url=f"https://mcp.amap.com/mcp?key={os.environ['GAODE_API_KEY']}",
)

stateless_client = HttpStatelessClient(
    # The name to identify the MCP
    name="mcp_services_stateless",
    transport="streamable_http",
    url=f"https://mcp.amap.com/mcp?key={os.environ['GAODE_API_KEY']}",
)

# %%
# Both stateful and stateless clients provide the following methods:
#
# .. list-table:: MCP Client Methods
#    :header-rows: 1
#
#    * - Method
#      - Description
#    * - ``list_tools``
#      - List all tools available in the MCP server.
#    * - ``get_callable_function``
#      - Get a callable function object from the MCP server by its name.
#
# MCP as Tool
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# AgentScope provides fine-grained management of MCP tools, including both server-level and function-level management.
#
# Server-Level Management
# --------------------------------
# You can register all tools from an MCP server into ``Toolkit`` as follows.
#
# .. tip:: Optionally, you can specify a group name to organize the tools. Refer to :ref:`tool` section for group-wise tools management.
#

toolkit = Toolkit()


async def example_register_stateless_mcp() -> None:
    """Example of registering MCP tools from a stateless client."""
    # Register all tools from the MCP server
    await toolkit.register_mcp_client(
        stateless_client,
        # group_name="map_services",  # Optional group name
    )

    print(
        "Total number of MCP tools registered:",
        len(toolkit.get_json_schemas()),
    )

    maps_geo = next(
        tool
        for tool in toolkit.get_json_schemas()
        if tool["function"]["name"] == "maps_geo"
    )
    print("\nThe example ``maps_geo`` function:")
    print(
        json.dumps(
            maps_geo,
            indent=4,
            ensure_ascii=False,
        ),
    )


asyncio.run(example_register_stateless_mcp())

# %%
# To remove the registered tools, you can use the ``remove_tool_function`` to remove a specific tool function, or ``remove_mcp_clients`` to remove all tools from a specific MCP.
#


async def example_remove_mcp_tools() -> None:
    """Example of removing MCP tools."""
    print(
        "Total number of tools before removal: ",
        len(toolkit.get_json_schemas()),
    )

    # Remove a specific tool function by its name
    toolkit.remove_tool_function("maps_geo")
    print("Number of tools: ", len(toolkit.get_json_schemas()))

    # Remove all tools from the MCP client by its name
    await toolkit.remove_mcp_clients(client_names=["mcp_services_stateless"])
    print("Number of tools: ", len(toolkit.get_json_schemas()))


asyncio.run(example_remove_mcp_tools())

# %%
# Function-Level Management
# --------------------------------
# We notice the demand for more fine-grained control over MCP tools, such as post-processing the tool results, or use them to create a more complex tool function.
#
# Therefore, AgentScope supports to obtain the callable function object from MCP by its name, so that you can
#
# - call it directly,
# - wrap it into your own function, or anyway you like.
#
# Additionally, you can specify whether to wrap the tool result into ``ToolResponse`` object in AgentScope, so that you can use it seamlessly with the ``Toolkit``.
# If you set ``wrap_tool_result=False``, the raw result type ``mcp.types.CallToolResult`` will be returned.
#
# Taking the ``maps_geo`` function as an example, you can obtain it as a callable function object as follows:
#


async def example_function_level_usage() -> None:
    """Example of using function-level MCP tool."""
    func_obj = await stateless_client.get_callable_function(
        func_name="maps_geo",
        # Whether to wrap the tool result into ToolResponse in AgentScope
        wrap_tool_result=True,
    )

    # You can obtain its name, description and json schema
    print("Function name:", func_obj.name)
    print("Function description:", func_obj.description)
    print(
        "Function JSON schema:",
        json.dumps(func_obj.json_schema, indent=4, ensure_ascii=False),
    )

    # Call the function object directly
    res = await func_obj(
        address="Tiananmen Square",
        city="Beijing",
    )
    print("\nFunction call result:")
    print(res)


asyncio.run(example_function_level_usage())

# %%
# Further Reading
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# For more details, see:
#
# - :ref:`tool`
# - :ref:`agent`
#



================================================
FILE: docs/tutorial/en/src/task_memory.py
================================================
# -*- coding: utf-8 -*-
"""
.. _memory:

Memory
========================

The memory module in AgentScope is responsible for

- storing the messages and
- managing them with specific marks
in different storage implementations.

The **mark** is a string label associated with each message in the memory,
which can be used to categorize, filter, and retrieve messages based on their
context or purpose.

It's powerful for high-level memory management in agents. For example,
In `ReActAgent` class, the hint messages are stored with the
mark "hint", and the memory compression functionality is also implemented
based on marks.

.. note:: The memory module only provides storage and management
 functionalities. The algorithm logic such as compression is implemented in
 the agent level.

Currently, AgentScope provides the following memory storage implementations:

.. list-table:: The built-in memory storage implementations in AgentScope
    :header-rows: 1

    * - Memory Class
      - Description
    * - ``InMemoryMemory``
      - A simple in-memory implementation of memory storage.
    * - ``AsyncSQLAlchemyMemory``
      - An asynchronous SQLAlchemy-based implementation of memory storage, which supports various databases such as SQLite, PostgreSQL, MySQL, etc.
    * - ``RedisMemory``
      - A Redis-based implementation of memory storage.

.. tip:: If you're interested in contributing new memory storage implementations, please refer to the
 `Contribution Guide <https://github.com/agentscope-ai/agentscope/blob/main/CONTRIBUTING.md#types-of-contributions>`_.

All the above memory classes inherit from the base class ``MemoryBase``, and
provide the following methods to manage the messages in the memory:

.. list-table:: The methods provided by the memory classes
    :header-rows: 1

    * - Method
      - Description
    * - ``add(
            memories: Msg | list[Msg] | None,
            marks: str | list[str] | None = None,
        ) -> None``
      - Add ``Msg`` object(s) to the memory storage with the given mark(s) (if provided).
    * - ``delete(msg_ids: list[str]) -> int``
      - Delete messages from the memory storage by their IDs.
    * - ``delete_by_mark(mark: str | list[str]) -> int``
      - Delete messages from the memory by their marks.
    * - ``size() -> int``
        - Get the size of the memory storage.
    * - ``clear() -> None``
      - Clear the memory storage.
    * - ``get_memory(
            mark: str | None = None,
            exclude_mark: str | None = None,
        ) -> list[Msg]``
      - Get the messages from the memory by mark (if provided). Otherwise, get all messages. If the ``update_compressed_summary`` method is used to store a compressed summary, it will be attached to the head of the returned messages.
    * - ``update_messages_mark(
            new_mark: str | None,
            old_mark: str | None = None,
            msg_ids: list[str] | None = None,
        ) -> int``
      - A unified method to update marks of messages in the storage (add, remove, or change marks).
    * - ``update_compressed_summary(
            summary: str,
        ) -> None``
      - Update the summary attribute stored in the memory.
"""
import asyncio
import json

import fakeredis
from sqlalchemy.ext.asyncio import create_async_engine

from agentscope.memory import (
    InMemoryMemory,
    AsyncSQLAlchemyMemory,
    RedisMemory,
)
from agentscope.message import Msg


# %%
# In-Memory Memory
# ~~~~~~~~~~~~~~~~~~~~~~~~
#
# The in-memory memory provides a simple way to store messages in memory.
# Together with the :ref:`state` module, it can persist the memory content across
# different users and sessions.


async def in_memory_example():
    """An example of using InMemoryMemory to store messages in memory."""
    memory = InMemoryMemory()
    await memory.add(
        Msg("Alice", "Generate a report about AgentScope", "user"),
    )

    # Add a hint message with the mark "hint"
    await memory.add(
        [
            Msg(
                "system",
                "<system-hint>Create a plan first to collect information and "
                "generate the report step by step.</system-hint>",
                "system",
            ),
        ],
        marks="hint",
    )

    msgs = await memory.get_memory(mark="hint")
    print("The messages with mark 'hint':")
    for msg in msgs:
        print(f"- {msg}")

    # All the stored messages can be exported and loaded via ``state_dict`` and ``load_state_dict`` methods.
    state = memory.state_dict()
    print("The state dict of the memory:")
    print(json.dumps(state, indent=2))

    # delete messages by mark
    deleted_count = await memory.delete_by_mark("hint")
    print(f"Deleted {deleted_count} messages with mark 'hint'.")

    print("The state dict of the memory after deletion:")
    state = memory.state_dict()
    print(json.dumps(state, indent=2))


asyncio.run(in_memory_example())

# %%
# Relational Database Memory
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# AgentScope provides a unified interface to work with relational databases via SQLAlchemy, supporting
#
# - various databases such as SQLite, PostgreSQL, MySQL, etc.
# - user and session management, and
# - connection pooling in the production environment
#
# Specifically, here we use a memory backed by SQLite as an example.


async def sqlalchemy_example() -> None:
    """An example of using AsyncSQLAlchemyMemory to store messages in a SQLite database."""

    # Create an async SQLAlchemy engine first
    engine = create_async_engine("sqlite+aiosqlite:///./test_memory.db")

    # Then create the memory with the engine
    memory = AsyncSQLAlchemyMemory(
        engine_or_session=engine,
        # Optionally specify user_id and session_id
        user_id="user_1",
        session_id="session_1",
    )

    await memory.add(
        Msg("Alice", "Generate a report about AgentScope", "user"),
    )

    await memory.add(
        [
            Msg(
                "system",
                "<system-hint>Create a plan first to collect information and "
                "generate the report step by step.</system-hint>",
                "system",
            ),
        ],
        marks="hint",
    )

    msgs = await memory.get_memory(mark="hint")
    print("The messages with mark 'hint':")
    for msg in msgs:
        print(f"- {msg}")

    # Close the engine when done
    await memory.close()


asyncio.run(sqlalchemy_example())

# %%
# Optionally, you can also use the ``AsyncSQLAlchemyMemory`` as an async context manager, and the session will be closed automatically when exiting the context.


async def sqlalchemy_context_example() -> None:
    """Example of using AsyncSQLAlchemyMemory as an async context manager."""
    engine = create_async_engine("sqlite+aiosqlite:///./test_memory.db")
    async with AsyncSQLAlchemyMemory(
        engine_or_session=engine,
        user_id="user_1",
        session_id="session_1",
    ) as memory:
        await memory.add(
            Msg("Alice", "Generate a report about AgentScope", "user"),
        )

        msgs = await memory.get_memory()
        print("All messages in the memory:")
        for msg in msgs:
            print(f"- {msg}")


asyncio.run(sqlalchemy_context_example())

# %%
# In production environment e.g. with FastAPI, the connection pooling can be enabled as follows:
#
# .. code-block:: python
#    :caption: SQLAlchemy Memory with Connection Pooling in FastAPI
#
#    from typing import AsyncGenerator
#
#     from fastapi import FastAPI, Depends
#     from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
#
#     from agentscope.agent import ReActAgent
#     from agentscope.pipeline import stream_printing_messages
#
#
#     app = FastAPI()
#
#     # Create an async SQLAlchemy engine with connection pooling
#     engine = create_async_engine(
#         "sqlite+aiosqlite:///./test_memory.db",
#         pool_size=10,
#         max_overflow=20,
#         pool_timeout=30,
#         # ...  The other pool settings
#     )
#
#     # Create a session maker
#     async_session_marker = async_sessionmaker(
#         engine,
#         expire_on_commit=False,
#         autocommit=False,
#         autoflush=False,
#     )
#
#     async def get_db() -> AsyncGenerator[AsyncSession, None]:
#         async with async_session_marker() as session:
#             try:
#                 yield session
#                 await session.commit()
#             except Exception:
#                 await session.rollback()
#                 raise
#             finally:
#                 await session.close()
#
#     @app.post("/chat")
#     async def chat_endpoint(
#         user_id: str,
#         session_id: str,
#         input: str,
#         db_session: AsyncSession = Depends(get_db),
#     ):
#         # Some setup for the agent
#         ...
#
#         # Create the agent with the SQLAlchemy memory
#         agent = ReActAgent(
#             # ...
#             memory=AsyncSQLAlchemyMemory(
#                 engine_or_session=db_session,
#                 user_id=user_id,
#                 session_id=session_id,
#             ),
#         )
#
#         # Handle the chat with the agent
#         async for msg, _ in stream_printing_messages(
#             agents=[agent],
#             coroutine_task=agent(Msg("user", input, "user")),
#         ):
#             # yield msg to the client
#             ...
#
#
# NoSQL Database Memory
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# AgentScope also provides memory implementations based on NoSQL databases such as Redis.
# It also supports user and session management, and connection pooling in the production environment.
#
# First, we can initialize the Redis memory as follows:


async def redis_memory_example() -> None:
    """An example of using RedisMemory to store messages in Redis."""
    # Use fakeredis for in-memory testing without a real Redis server
    fake_redis = fakeredis.aioredis.FakeRedis(decode_responses=True)
    # Create the Redis memory
    memory = RedisMemory(
        # Using fake redis for demonstration
        connection_pool=fake_redis.connection_pool,
        # You can also connect to a real Redis server by specifying host and port
        # host="localhost",
        # port=6379,
        # Optionally specify user_id and session_id
        user_id="user_1",
        session_id="session_1",
    )

    # Add a message to the memory
    await memory.add(
        Msg(
            "Alice",
            "Generate a report about AgentScope",
            "user",
        ),
    )

    # Add a hint message with the mark "hint"
    await memory.add(
        Msg(
            "system",
            "<system-hint>Create a plan first to collect information and "
            "generate the report step by step.</system-hint>",
            "system",
        ),
        marks="hint",
    )

    # Retrieve messages with the mark "hint"
    msgs = await memory.get_memory(mark="hint")
    print("The messages with mark 'hint':")
    for msg in msgs:
        print(f"- {msg}")


asyncio.run(redis_memory_example())

# %%
# Similarly, the `RedisMemory` can also be used with connection pooling in the production environment, e.g., with FastAPI.
#
# .. code-block:: python
#    :caption: Redis Memory with Connection Pooling in FastAPI
#
#     from fastapi import FastAPI, HTTPException
#     from redis.asyncio import ConnectionPool
#     from contextlib import asynccontextmanager
#
#     # Global Redis connection pool
#     redis_pool: ConnectionPool | None = None
#
#
#     # Use the lifespan event to manage the Redis connection pool
#     @asynccontextmanager
#     async def lifespan(app: FastAPI):
#         global redis_pool
#         redis_pool = ConnectionPool(
#             host="localhost",
#             port=6379,
#             db=0,
#             password=None,
#             decode_responses=True,
#             max_connections=10,
#             encoding="utf-8",
#         )
#         print("✅ Redis connection established")
#
#         yield
#
#         await redis_pool.disconnect()
#         print("✅ Redis connection closed")
#
#
#     app = FastAPI(lifespan=lifespan)
#
#
#     @app.post("/chat_endpoint")
#     async def chat_endpoint(
#         user_id: str, session_id: str, input: str
#     ):  # ✅ 直接使用BaseModel
#         """A chat endpoint"""
#         global redis_pool
#         if redis_pool is None:
#             raise HTTPException(
#                 status_code=500,
#                 detail="Redis connection pool is not initialized.",
#             )
#
#         # Create the Redis memory
#         memory = RedisMemory(
#             connection_pool=redis_pool,
#             user_id=user_id,
#             session_id=session_id,
#         )
#
#         ...
#
#         # Close the Redis client connection when done
#         client = memory.get_client()
#         await client.aclose()
#
#
#
# Customizing Memory
# ~~~~~~~~~~~~~~~~~~~~~~~~
#
# To customize your own memory, just inherit from ``MemoryBase`` and implement the following methods:
#
# .. list-table::
#     :header-rows: 1
#
#     * - Method
#       - Description
#     * - ``add``
#       - Add ``Msg`` objects to the memory
#     * - ``delete``
#       - Delete ``Msg`` objects from the memory
#     * - ``delete_by_mark``
#       - Delete ``Msg`` objects from the memory by their marks
#     * - ``size``
#       - The size of the memory
#     * - ``clear``
#       - Clear the memory content
#     * - ``get_memory``
#       - Get the memory content as a list of ``Msg`` objects
#     * - ``update_messages_mark``
#       - Update marks of messages in the memory
#     * - ``state_dict``
#       - Get the state dictionary of the memory
#     * - ``load_state_dict``
#       - Load the state dictionary of the memory
#
# Further Reading
# ~~~~~~~~~~~~~~~~~~~~~~~~
# - :ref:`agent`
# - :ref:`long-term-memory`



================================================
FILE: docs/tutorial/en/src/task_middleware.py
================================================
# -*- coding: utf-8 -*-
"""
.. _middleware:

Middleware
===========================

AgentScope provides a flexible middleware system that allows developers to intercept and modify the execution of various operations.
Currently, middleware support is available for **tool execution** in the ``Toolkit`` class.

The middleware system follows an **onion model**, where each middleware wraps around the previous one, forming layers.
This allows developers to:

- Perform **pre-processing** before the operation
- **Intercept and modify** responses during execution
- Perform **post-processing** after the operation completes
- **Skip** the operation execution entirely based on conditions

.. tip:: Future versions of AgentScope will expand middleware support to other components such as agents and models.

"""
import asyncio
from typing import AsyncGenerator, Callable

from agentscope.message import TextBlock, ToolUseBlock
from agentscope.tool import ToolResponse, Toolkit


# %%
# Tool Execution Middleware
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# The ``Toolkit`` class supports middleware for tool execution via the ``register_middleware`` method.
# Each middleware can intercept the tool call and modify the input or output.
#
# Middleware Signature
# ------------------------------
#
# A middleware function should have the following signature:
#
# .. code-block:: python
#
#     async def middleware(
#         kwargs: dict,
#         next_handler: Callable,
#     ) -> AsyncGenerator[ToolResponse, None]:
#         # Access parameters from kwargs
#         tool_call = kwargs["tool_call"]
#
#         # Pre-processing
#         # ...
#
#         # Call the next middleware or tool function
#         async for response in await next_handler(**kwargs):
#             # Post-processing
#             yield response
#
# .. list-table:: Middleware Parameters
#    :header-rows: 1
#
#    * - Parameter
#      - Type
#      - Description
#    * - ``kwargs``
#      - ``dict``
#      - Context parameters. Currently, includes ``tool_call`` (ToolUseBlock). May include additional parameters in future versions.
#    * - ``next_handler``
#      - ``Callable``
#      - A callable that accepts kwargs dict and returns a coroutine yielding AsyncGenerator of ToolResponse objects
#    * - **Returns**
#      - ``AsyncGenerator[ToolResponse, None]``
#      - An async generator that yields ToolResponse objects
#
# Basic Example
# ------------------------------
#
# Here is a simple middleware that logs tool calls:
#


async def logging_middleware(
    kwargs: dict,
    next_handler: Callable,
) -> AsyncGenerator[ToolResponse, None]:
    """A middleware that logs tool execution."""
    # Access the tool call from kwargs
    tool_call = kwargs["tool_call"]

    # Pre-processing: log before tool execution
    print(f"[Middleware] Calling tool: {tool_call['name']}")
    print(f"[Middleware] Input: {tool_call['input']}")

    # Call the next handler (either another middleware or the actual tool)
    async for response in await next_handler(**kwargs):
        # Post-processing: log the response
        print(f"[Middleware] Response: {response.content[0]['text']}")
        yield response

    # This will execute after all responses are yielded
    print(f"[Middleware] Tool {tool_call['name']} completed")


# %%
# Let's register this middleware with a toolkit and test it:
#


async def search_tool(query: str) -> ToolResponse:
    """A simple search tool.

    Args:
        query (`str`):
            The search query.

    Returns:
        `ToolResponse`:
            The search result.
    """
    return ToolResponse(
        content=[
            TextBlock(
                type="text",
                text=f"Search results for '{query}'",
            ),
        ],
    )


async def example_logging_middleware() -> None:
    """Example of using logging middleware."""
    # Create a toolkit and register the tool
    toolkit = Toolkit()
    toolkit.register_tool_function(search_tool)

    # Register the middleware
    toolkit.register_middleware(logging_middleware)

    # Call the tool
    result = await toolkit.call_tool_function(
        ToolUseBlock(
            type="tool_use",
            id="1",
            name="search_tool",
            input={"query": "AgentScope"},
        ),
    )

    async for response in result:
        print(f"\n[Final] {response.content[0]['text']}\n")


print("=" * 60)
print("Example 1: Logging Middleware")
print("=" * 60)
asyncio.run(example_logging_middleware())

# %%
# Modifying Input and Output
# ------------------------------
#
# Middleware can also modify the tool call input and the response content:
#


async def transform_middleware(
    kwargs: dict,
    next_handler: Callable,
) -> AsyncGenerator[ToolResponse, None]:
    """A middleware that transforms input and output."""
    # Access the tool call from kwargs
    tool_call = kwargs["tool_call"]

    # Pre-processing: modify the input
    original_query = tool_call["input"]["query"]
    tool_call["input"]["query"] = f"[TRANSFORMED] {original_query}"

    async for response in await next_handler(**kwargs):
        # Post-processing: modify the response
        original_text = response.content[0]["text"]
        response.content[0]["text"] = f"{original_text} [MODIFIED]"
        yield response


async def example_transform_middleware() -> None:
    """Example of transforming middleware."""
    toolkit = Toolkit()
    toolkit.register_tool_function(search_tool)
    toolkit.register_middleware(transform_middleware)

    result = await toolkit.call_tool_function(
        ToolUseBlock(
            type="tool_use",
            id="2",
            name="search_tool",
            input={"query": "middleware"},
        ),
    )

    async for response in result:
        print(f"Result: {response.content[0]['text']}")


print("\n" + "=" * 60)
print("Example 2: Transform Middleware")
print("=" * 60)
asyncio.run(example_transform_middleware())

# %%
# Authorization Middleware
# ------------------------------
#
# You can use middleware to implement authorization checks and skip tool execution if not authorized:
#


async def authorization_middleware(
    kwargs: dict,
    next_handler: Callable,
) -> AsyncGenerator[ToolResponse, None]:
    """A middleware that checks authorization."""
    # Access the tool call from kwargs
    tool_call = kwargs["tool_call"]

    # Check if the tool is authorized (simple example)
    authorized_tools = {"search_tool"}

    if tool_call["name"] not in authorized_tools:
        # Skip execution and return error directly
        print(f"[Auth] Tool {tool_call['name']} is not authorized")
        yield ToolResponse(
            content=[
                TextBlock(
                    type="text",
                    text=f"Error: Tool '{tool_call['name']}' is not authorized",  # noqa: E501
                ),
            ],
        )
        return

    # Tool is authorized, proceed
    print(f"[Auth] Tool {tool_call['name']} is authorized")
    async for response in await next_handler(**kwargs):
        yield response


async def unauthorized_tool(data: str) -> ToolResponse:
    """An unauthorized tool.

    Args:
        data (`str`):
            Some data.

    Returns:
        `ToolResponse`:
            The result.
    """
    return ToolResponse(
        content=[TextBlock(type="text", text=f"Processing {data}")],
    )


async def example_authorization_middleware() -> None:
    """Example of authorization middleware."""
    toolkit = Toolkit()
    toolkit.register_tool_function(search_tool)
    toolkit.register_tool_function(unauthorized_tool)
    toolkit.register_middleware(authorization_middleware)

    # Try authorized tool
    print("\nCalling authorized tool:")
    result = await toolkit.call_tool_function(
        ToolUseBlock(
            type="tool_use",
            id="3",
            name="search_tool",
            input={"query": "test"},
        ),
    )
    async for response in result:
        print(f"Result: {response.content[0]['text']}")

    # Try unauthorized tool
    print("\nCalling unauthorized tool:")
    result = await toolkit.call_tool_function(
        ToolUseBlock(
            type="tool_use",
            id="4",
            name="unauthorized_tool",
            input={"data": "test"},
        ),
    )
    async for response in result:
        print(f"Result: {response.content[0]['text']}")


print("\n" + "=" * 60)
print("Example 3: Authorization Middleware")
print("=" * 60)
asyncio.run(example_authorization_middleware())

# %%
# Multiple Middleware (Onion Model)
# ------------------------------
#
# When multiple middleware are registered, they form an onion-like structure.
# The execution order follows the onion model:
#
# - **Pre-processing**: Executes in the order middleware are registered
# - **Post-processing**: Executes in reverse order (inner to outer)
#
# This is because the actual tool response object is passed through the middleware chain,
# and each middleware modifies it in place.
#


async def middleware_1(
    kwargs: dict,
    next_handler: Callable,
) -> AsyncGenerator[ToolResponse, None]:
    """First middleware."""
    # Access the tool call from kwargs
    tool_call = kwargs["tool_call"]

    # Pre-processing
    print("[M1] Pre-processing")
    tool_call["input"]["query"] += " [M1]"

    async for response in await next_handler(**kwargs):
        # Post-processing
        response.content[0]["text"] += " [M1]"
        print("[M1] Post-processing")
        yield response


async def middleware_2(
    kwargs: dict,
    next_handler: Callable,
) -> AsyncGenerator[ToolResponse, None]:
    """Second middleware."""
    # Access the tool call from kwargs
    tool_call = kwargs["tool_call"]

    # Pre-processing
    print("[M2] Pre-processing")
    tool_call["input"]["query"] += " [M2]"

    async for response in await next_handler(**kwargs):
        # Post-processing
        response.content[0]["text"] += " [M2]"
        print("[M2] Post-processing")
        yield response


async def example_multiple_middleware() -> None:
    """Example of multiple middleware."""
    toolkit = Toolkit()
    toolkit.register_tool_function(search_tool)

    # Register middleware in order
    toolkit.register_middleware(middleware_1)
    toolkit.register_middleware(middleware_2)

    result = await toolkit.call_tool_function(
        ToolUseBlock(
            type="tool_use",
            id="5",
            name="search_tool",
            input={"query": "test"},
        ),
    )

    async for response in result:
        print(f"\nFinal result: {response.content[0]['text']}")


print("\n" + "=" * 60)
print("Example 4: Multiple Middleware (Onion Model)")
print("=" * 60)
print("\nExecution flow:")
print("M1 Pre → M2 Pre → Tool → M2 Post → M1 Post")
print()
asyncio.run(example_multiple_middleware())

# %%
# Use Cases
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# The middleware system is useful for various scenarios:
#
# - **Logging and Monitoring**: Track tool usage and performance
# - **Authorization**: Control access to specific tools
# - **Rate Limiting**: Limit the frequency of tool calls
# - **Caching**: Cache tool responses for repeated calls
# - **Error Handling**: Add retry logic or graceful degradation
# - **Input Validation**: Validate and sanitize tool inputs
# - **Output Transformation**: Format or filter tool outputs
# - **Metrics Collection**: Collect statistics about tool usage
#
# .. note::
#     - Middleware are applied in the order they are registered
#     - The same ``ToolResponse`` object is passed through the middleware chain and modified in place
#     - Middleware can completely skip tool execution by not calling ``next_handler``
#     - All middleware must be async generator functions that yield ``ToolResponse`` objects



================================================
FILE: docs/tutorial/en/src/task_model.py
================================================
# -*- coding: utf-8 -*-
"""
.. _model:

Model
====================

In this tutorial, we introduce the model APIs integrated in AgentScope, how to use them and how to integrate new model APIs.
The supported model APIs and providers include:

.. list-table::
    :header-rows: 1

    * - API
      - Class
      - Compatible
      - Streaming
      - Tools
      - Vision
      - Reasoning
    * - OpenAI
      - ``OpenAIChatModel``
      - vLLM, DeepSeek
      - ✅
      - ✅
      - ✅
      - ✅
    * - DashScope
      - ``DashScopeChatModel``
      -
      - ✅
      - ✅
      - ✅
      - ✅
    * - Anthropic
      - ``AnthropicChatModel``
      -
      - ✅
      - ✅
      - ✅
      - ✅
    * - Gemini
      - ``GeminiChatModel``
      -
      - ✅
      - ✅
      - ✅
      - ✅
    * - Ollama
      - ``OllamaChatModel``
      -
      - ✅
      - ✅
      - ✅
      - ✅

.. note:: When using vLLM, you need to configure the appropriate tool calling parameters for different models during deployment, such as ``--enable-auto-tool-choice``, ``--tool-call-parser``, etc. For more details, refer to the `official vLLM documentation <https://docs.vllm.ai/en/latest/features/tool_calling.html>`_.

.. note:: For OpenAI-compatible models (e.g. vLLM, Deepseek), developers can use the ``OpenAIChatModel`` class, and specify the API endpoint by the ``client_kwargs`` parameter: ``client_kwargs={"base_url": "http://your-api-endpoint"}``. For example:

    .. code-block:: python

        OpenAIChatModel(client_kwargs={"base_url": "http://localhost:8000/v1"})

.. note:: Model behavior parameters (such as temperature, maximum length, etc.) can be preset in the constructor function via the ``generate_kwargs`` parameter. For example:

    .. code-block:: python

        OpenAIChatModel(generate_kwargs={"temperature": 0.3, "max_tokens": 1000})

To provide unified model interfaces, the above model classes has the following common methods:

- The first three arguments of the ``__call__`` method are ``messages`` , ``tools`` and ``tool_choice``, representing the input messages, JSON schema of tool functions, and tool selection mode, respectively.
- The return type are either a ``ChatResponse`` instance or an async generator of ``ChatResponse`` in streaming mode.

.. note:: Different model APIs differ in the input message format, refer to :ref:`prompt` for more details.

The ``ChatResponse`` instance contains the generated thinking/text/tool use content, identity, created time and usage information.
"""
import asyncio
import json
import os

from agentscope.message import TextBlock, ToolUseBlock, ThinkingBlock, Msg
from agentscope.model import ChatResponse, DashScopeChatModel

response = ChatResponse(
    content=[
        ThinkingBlock(
            type="thinking",
            thinking="I should search for AgentScope on Google.",
        ),
        TextBlock(type="text", text="I'll search for AgentScope on Google."),
        ToolUseBlock(
            type="tool_use",
            id="642n298gjna",
            name="google_search",
            input={"query": "AgentScope?"},
        ),
    ],
)

print(response)

# %%
# Taking ``DashScopeChatModel`` as an example, we can use it to create a chat model instance and call it with messages and tools:


async def example_model_call() -> None:
    """An example of using the DashScopeChatModel."""
    model = DashScopeChatModel(
        model_name="qwen-max",
        api_key=os.environ["DASHSCOPE_API_KEY"],
        stream=False,
    )

    res = await model(
        messages=[
            {"role": "user", "content": "Hi!"},
        ],
    )

    # You can directly create a ``Msg`` object with the response content
    msg_res = Msg("Friday", res.content, "assistant")

    print("The response:", res)
    print("The response as Msg:", msg_res)


asyncio.run(example_model_call())

# %%
# Streaming
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# To enable streaming model, set the ``stream`` parameter in the model constructor to ``True``.
# When streaming is enabled, the ``__call__`` method will return an **async generator** that yields ``ChatResponse`` instances as they are generated by the model.
#
# .. note:: The streaming mode in AgentScope is designed to be **cumulative**, meaning the content in each chunk contains all the previous content plus the newly generated content.
#


async def example_streaming() -> None:
    """An example of using the streaming model."""
    model = DashScopeChatModel(
        model_name="qwen-max",
        api_key=os.environ["DASHSCOPE_API_KEY"],
        stream=True,
    )

    generator = await model(
        messages=[
            {
                "role": "user",
                "content": "Count from 1 to 20, and just report the number without any other information.",
            },
        ],
    )
    print("The type of the response:", type(generator))

    i = 0
    async for chunk in generator:
        print(f"Chunk {i}")
        print(f"\ttype: {type(chunk.content)}")
        print(f"\t{chunk}\n")
        i += 1


asyncio.run(example_streaming())

# %%
# Reasoning
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# AgentScope supports reasoning models by providing the ``ThinkingBlock``.
#


async def example_reasoning() -> None:
    """An example of using the reasoning model."""
    model = DashScopeChatModel(
        model_name="qwen-turbo",
        api_key=os.environ["DASHSCOPE_API_KEY"],
        enable_thinking=True,
    )

    res = await model(
        messages=[
            {"role": "user", "content": "Who am I?"},
        ],
    )

    last_chunk = None
    async for chunk in res:
        last_chunk = chunk
    print("The final response:")
    print(last_chunk)


asyncio.run(example_reasoning())

# %%
# Tools API
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Different model providers differ in their tools APIs, e.g. the tools JSON schema, the tool call/response format.
# To provide a unified interface, AgentScope solves the problem by:
#
# - Providing unified tool call block :ref:`ToolUseBlock <tool-block>` and tool response block :ref:`ToolResultBlock <tool-block>`, respectively.
# - Providing a unified tools interface in the ``__call__`` method of the model classes, that accepts a list of tools JSON schemas as follows:
#

json_schemas = [
    {
        "type": "function",
        "function": {
            "name": "google_search",
            "description": "Search for a query on Google.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query.",
                    },
                },
                "required": ["query"],
            },
        },
    },
]

# %%
# Further Reading
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# - :ref:`message`
# - :ref:`prompt`
#



================================================
FILE: docs/tutorial/en/src/task_pipeline.py
================================================
# -*- coding: utf-8 -*-
"""
.. _pipeline:

Pipeline
========================

For multi-agent orchestration, AgentScope provides the ``agentscope.pipeline`` module
as syntax sugar for chaining agents together, including

- **MsgHub**: a message hub for broadcasting messages among multiple agents
- **sequential_pipeline** and **SequentialPipeline**: a functional and class-based implementation that chains agents in a sequential manner
- **fanout_pipeline** and **FanoutPipeline**: a functional and class-based implementation that distributes the same input to multiple agents
- **stream_printing_messages**: a utility function that convert the printing messages from agent(s) into an async generator

"""

import os, asyncio

from agentscope.formatter import DashScopeMultiAgentFormatter
from agentscope.message import Msg
from agentscope.model import DashScopeChatModel
from agentscope.agent import ReActAgent
from agentscope.pipeline import MsgHub, stream_printing_messages


# %%
# Broadcasting with MsgHub
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# The ``MsgHub`` class is an **async context manager**, receiving a list of agents as its participants.
# When one participant generates a replying message, all other participants will receive this message by calling their ``observe`` method.
#
# That means within a ``MsgHub`` context, developers don't need to manually send a replying message from one agent to another.
# The broadcasting is automatically handled.
#
# Here we create four agents: Alice, Bob, Charlie and David.
# Then we start a meeting with Alice, Bob and Charlie by introducing themselves.
# Note David is not included in this meeting.


def create_agent(name: str, age: int, career: str) -> ReActAgent:
    """Create agent object by the given information."""
    return ReActAgent(
        name=name,
        sys_prompt=f"You're {name}, a {age}-year-old {career}",
        model=DashScopeChatModel(
            model_name="qwen-max",
            api_key=os.environ["DASHSCOPE_API_KEY"],
        ),
        formatter=DashScopeMultiAgentFormatter(),
    )


alice = create_agent("Alice", 50, "teacher")
bob = create_agent("Bob", 35, "engineer")
charlie = create_agent("Charlie", 28, "designer")
david = create_agent("David", 30, "developer")

# %%
# Then we start a meeting and let them introduce themselves without manual message passing:
#
# .. hint:: The message in ``announcement`` will be broadcasted to all participants when entering the ``MsgHub`` context.
#


async def example_broadcast_message():
    """Example of broadcasting messages with MsgHub."""

    # Create a message hub
    async with MsgHub(
        participants=[alice, bob, charlie],
        announcement=Msg(
            "user",
            "Now introduce yourself in one sentence, including your name, age and career.",
            "user",
        ),
    ) as hub:
        # Group chat without manual message passing
        await alice()
        await bob()
        await charlie()


asyncio.run(example_broadcast_message())

# %%
# Now let's check if Bob, Charlie and David received Alice's message.
#


async def check_broadcast_message():
    """Check if the messages are broadcast correctly."""
    user_msg = Msg(
        "user",
        "Do you know who's Alice, and what she does? Answer me briefly.",
        "user",
    )

    await bob(user_msg)
    await charlie(user_msg)
    await david(user_msg)


asyncio.run(check_broadcast_message())

# %%
# Now we observe that Bob and Charlie know Alice and her profession, while David has no idea
# about Alice since he is not included in the ``MsgHub`` context.
#
#
# Dynamic Participant Management
# ---------------------------------------
# Additionally, ``MsgHub`` supports to dynamically manage participants by the following methods:
#
# - ``add``: add one or multiple agents as new participants
# - ``delete``: remove one or multiple agents from participants, and they will no longer receive broadcasted messages
# - ``broadcast``: broadcast a message to all current participants
#
# .. note:: The newly added participants will not receive the previous messages.
#
# .. code-block:: python
#
#       async with MsgHub(participants=[alice]) as hub:
#           # Add new participants
#           hub.add(david)
#
#           # Remove participants
#           hub.delete(alice)
#
#           # Broadcast to all current participants
#           await hub.broadcast(
#               Msg("system", "Now we begin to ...", "system"),
#           )
#
#
# Pipeline
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Pipeline serves as a syntax sugar for multi-agent orchestration.
#
# Currently, AgentScope provides three main pipeline implementations:
#
# 1. **Sequential Pipeline**: Execute agents one by one in a predefined order
# 2. **Fanout Pipeline**: Distribute the same input to multiple agents and collect their responses
# 3. **Stream Printing Messages**: Convert the printing messages from an agent into an async generator
#
# Sequential Pipeline
# ------------------------
# The sequential pipeline executes agents one by one, where the output of the previous agent
# becomes the input of the next agent.
#
# For example, the two following code snippets are equivalent:
#
#
# .. code-block:: python
#     :caption: Code snippet 1: Manually call agents one by one
#
#     msg = None
#     msg = await alice(msg)
#     msg = await bob(msg)
#     msg = await charlie(msg)
#     msg = await david(msg)
#
#
# .. code-block:: python
#     :caption: Code snippet 2: Use sequential pipeline
#
#     from agentscope.pipeline import sequential_pipeline
#     msg = await sequential_pipeline(
#         # List of agents to be executed in order
#         agents=[alice, bob, charlie, david],
#         # The first input message, can be None
#         msg=None
#     )
#

# %%
# Fanout Pipeline
# ------------------------
# The fanout pipeline distributes the same input message to multiple agents simultaneously and collects all their responses. This is useful when you want to gather different perspectives or expertise on the same topic.
#
# For example, the two following code snippets are equivalent:
#
#
# .. code-block:: python
#     :caption: Code snippet 3: Manually call agents one by one
#
#     from copy import deepcopy
#
#     msgs = []
#     msg = None
#     for agent in [alice, bob, charlie, david]:
#         msgs.append(await agent(deepcopy(msg)))
#
#
# .. code-block:: python
#     :caption: Code snippet 4: Use fanout pipeline
#
#     from agentscope.pipeline import fanout_pipeline
#     msgs = await fanout_pipeline(
#         # List of agents to be executed in order
#         agents=[alice, bob, charlie, david],
#         # The first input message, can be None
#         msg=None,
#         enable_gather=False,
#     )
#
# .. note::
#     The ``enable_gather`` parameter controls the execution mode of the fanout pipeline:
#
#     - ``enable_gather=True`` (default): Executes all agents **concurrently** using ``asyncio.gather()``. This provides better performance for I/O-bound operations like API calls, as agents run in parallel.
#     - ``enable_gather=False``: Executes agents **sequentially** one by one. This is useful when you need deterministic execution order or want to avoid overwhelming external services with concurrent requests.
#
#     Choose concurrent execution for better performance, or sequential execution for predictable ordering and resource control.
#
# .. tip::
#     By combining ``MsgHub`` and ``sequential_pipeline`` or ``fanout_pipeline``, you can create more complex workflows very easily.
#
#
# Stream Printing Messages
# -------------------------------------
# The ``stream_printing_messages`` function converts the printing messages from agent(s) into an async generator.
# It will help you to obtain the intermediate messages from the agent(s) in a streaming way.
#
# It accepts a list of agents and a coroutine task, then returns an async generator that yields tuples of ``(Msg, bool)``,
# containing the printing message during execution of the coroutine task.
#
# Note the messages with the same ``id`` are considered as the same message, and the ``last`` flag indicates whether it's the last chunk of this message.
#
# Taking the following code snippet as an example:


async def run_example_pipeline() -> None:
    """Run an example of streaming printing messages."""
    agent = create_agent("Alice", 20, "student")

    # We disable the terminal printing to avoid messy outputs
    agent.set_console_output_enabled(False)

    async for msg, last in stream_printing_messages(
        agents=[agent],
        coroutine_task=agent(
            Msg("user", "Hello, who are you?", "user"),
        ),
    ):
        print(msg, last)
        if last:
            print()


asyncio.run(run_example_pipeline())


# %%
# Advanced Pipeline Features
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# Additionally, for reusability, we also provide a class-based implementation:
#
# .. code-block:: python
#     :caption: Using SequentialPipeline class
#
#     from agentscope.pipeline import SequentialPipeline
#
#     # Create a pipeline object
#     pipeline = SequentialPipeline(agents=[alice, bob, charlie, david])
#
#     # Call the pipeline
#     msg = await pipeline(msg=None)
#
#     # Reuse the pipeline with different input
#     msg = await pipeline(msg=Msg("user", "Hello!", "user"))
#
#
# .. code-block:: python
#     :caption: Using FanoutPipeline class
#
#     from agentscope.pipeline import FanoutPipeline
#
#     # Create a pipeline object
#     pipeline = FanoutPipeline(agents=[alice, bob, charlie, david])
#
#     # Call the pipeline
#     msgs = await pipeline(msg=None)
#
#     # Reuse the pipeline with different input
#     msgs = await pipeline(msg=Msg("user", "Hello!", "user"))
#



================================================
FILE: docs/tutorial/en/src/task_plan.py
================================================
# -*- coding: utf-8 -*-
"""
.. _plan:

Plan
=========================

The Plan Module enables agents to formally break down complex tasks into manageable sub-tasks and execute them systematically. Key features include:

- Support **manual plan specification**
- Comprehensive plan management capabilities:
   - **Creating, modifying, abandoning, and restoring** plans
   - **Switching** between multiple plans
   - **Gracefully handling interruptions** by temporarily suspending plans to address user queries or urgent tasks
- **Real-time visualization and monitoring** of plan execution

.. note:: The current plan module has the following limitations, and we are working on improving them:

 - The subtasks in a plan must be executed sequentially

Specifically, the plan module works by

- providing tool functions for plan management
- inserting hint messages to guide the ReAct agent to complete the plan

The following figure illustrates how the plan module works with the ReAct agent:

.. figure:: ../../_static/images/plan.png
    :width: 90%
    :alt: Plan module
    :class: bordered-image
    :align: center

    How the plan module works with the ReAct agent

"""
import asyncio
import os

from agentscope.agent import ReActAgent
from agentscope.formatter import DashScopeChatFormatter
from agentscope.model import DashScopeChatModel
from agentscope.plan import PlanNotebook, Plan, SubTask

# %%
# PlanNotebook
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# The `PlanNotebook` class is the core of the plan module, responsible for providing
#
# - plan-related tool functions
# - hint messages to guide the agent to finish the plan
#
# The `PlanNotebook` class can be instantiated with the following parameters:
#
# .. list-table:: Parameters of the `PlanNotebook` constructor
#   :header-rows: 1
#
#   * - Name
#     - Type
#     - Description
#   * - ``max_subtasks``
#     - ``int | None``
#     - The maximum number of subtasks allowed in a plan, infinite if None
#   * - ``plan_to_hint``
#     - ``Callable[[Plan | None], str | None] | None``
#     - The function to generate hint message based on the current plan. If not provided, a default `DefaultPlanToHint` object will be used.
#   * - ``storage``
#     - ``PlanStorageBase | None``
#     - The plan storage. If not provided, a default in-memory storage will be used.
#
# The ``plan_to_hint`` callable object is the most important part of the
# `PlanNotebook` class, also serves as the interface for prompt engineering.
# We have built a default `DefaultPlanToHint` class that can be used directly.
# Developers are encouraged to providing their own ``plan_to_hint`` function
# for better performance.
#
# The ``storage`` is to store historical plans, allowing agent to
# retrieve and restore historical plans. Developers are encouraged to
# implement their own plan storage by inheriting the ``PlanStorageBase`` class.
# If not provided, a default in-memory storage will be used.
#
# .. tip:: The ``PlanStorageBase`` class inherits from the ``StateModule``
#  class, so that the plan storage will also be saved and loaded by the
#  session management.
#
# The core attributes and methods of the `PlanNotebook` class are summarized
# as follows:
#
# .. list-table:: Core attributes and methods of the `PlanNotebook` class
#    :header-rows: 1
#
#    * - Type
#      - Name
#      - Description
#    * - attribute
#      - ``current_plan``
#      - The current plan that the agent is executing
#    * -
#      - ``storage``
#      - The storage for historical plans, used for retrieving and restoring historical plans
#    * -
#      - ``plan_to_hint``
#      - A callable object that takes the current plan as input and generates a hint message to guide the agent to finish the plan
#    * - method
#      - ``list_tools``
#      - List all the tool functions provided by the `PlanNotebook` class
#    * -
#      - ``get_current_hint``
#      - Get the hint message for the current plan, which will call the ``plan_to_hint`` function
#    * -
#      - | ``create_plan``,
#        | ``view_subtasks``,
#        | ``revise_current_plan``,
#        | ``update_subtask_state``,
#        | ``finish_subtask``,
#        | ``finish_plan``,
#        | ``view_historical_plans``,
#        | ``recover_historical_plan``
#      - The tool functions that allows the agent to manage the plan and subtasks
#    * -
#      - ``register_plan_change_hook``
#      - Register a hook function that will be called when the plan is changed, used to plan visualization and monitoring
#    * -
#      - ``remove_plan_change_hook``
#      - Remove a registered plan change hook function
#
# The ``list_tools`` method is a quick way to obtain all tool functions, so that you can register them to the agent's toolkit.

plan_notebook = PlanNotebook()


async def list_tools() -> None:
    """List the tool functions provided by PlanNotebook."""
    print("The tools provided by PlanNotebook:")
    for tool in plan_notebook.list_tools():
        print(tool.__name__)


asyncio.run(list_tools())


# %%
# Working with ReActAgent
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# The `ReActAgent` in AgentScope has integrated the plan module by a ``plan_notebook`` parameter in its constructor.
# Once provided, the agent will
#
# - be equipped with the plan management tool functions, and
# - be inserted with the hint messages at the beginning of each reasoning step
#
# There are two ways to use the plan module with the `ReActAgent`:
#
# - Manual plan specification: Users can manually create a plan by calling the ``create_plan`` tool function, and initialize the `ReActAgent` with the plan notebook.
# - Agent-managed plan execution: The agent will create and manage the plan by itself, by calling the plan management tool functions.
#
# Manual Plan Specification
# ---------------------------------
# Manually creating a plan is straightforward by calling the ``create_plan`` tool function.
# The following is an example of manually creating a plan to conduct a comprehensive research on the LLM-empowered agent.
#
async def manual_plan_specification() -> None:
    """Manual plan specification example."""
    await plan_notebook.create_plan(
        name="Research on Agent",
        description="Conduct a comprehensive research on the LLM-empowered agent.",
        expected_outcome="A Markdown format report answer three questions: 1. What's agent? 2. What's the current state of the art of agent? 3. What's the future trend of agent?",
        subtasks=[
            SubTask(
                name="Search agent-related survey papers",
                description=(
                    "Search for survey parers on multiple sources, including "
                    "Google Scholar, arXiv, and Semantic Scholar. Must be "
                    "published after 2021 and have more than 50 citations."
                ),
                expected_outcome="A paper list in Markdown format",
            ),
            SubTask(
                name="Read and summarize the papers",
                description=(
                    "Read the papers found in the previous step, and "
                    "summarize the key points, including the definition, "
                    "taxonomy, challenges, and key directions."
                ),
                expected_outcome="A summary of the key points in Markdown format",
            ),
            SubTask(
                name="Research on recent advances of large company",
                description=(
                    "Research on the recent advances of large companies, "
                    "including Google, Microsoft, OpenAI, Anthropic, Alibaba "
                    "and Meta. Find the official blogs or news articles."
                ),
                expected_outcome="A recent advances of large company ",
            ),
            SubTask(
                name="Write a report",
                description=(
                    "Write a report based on the previous steps, and answer "
                    "the three questions in the expected outcome."
                ),
                expected_outcome=(
                    "A Markdown format report answer three questions: 1. "
                    "What's agent? 2. What's the current state of the art of "
                    "agent? 3. What's the future trend of agent?"
                ),
            ),
        ],
    )

    print("The current hint message:\n")
    msg = await plan_notebook.get_current_hint()
    print(f"{msg.name}: {msg.content}")


asyncio.run(manual_plan_specification())

# %%
# After creating the plan, you can initialize the `ReActAgent` with the
# plan notebook as follows:

agent = ReActAgent(
    name="Friday",
    sys_prompt="You are a helpful assistant.",
    model=DashScopeChatModel(
        model_name="qwen-max",
        api_key=os.environ["DASHSCOPE_API_KEY"],
    ),
    formatter=DashScopeChatFormatter(),
    plan_notebook=plan_notebook,
)

# %%
# Agent-Managed Plan Execution
# ---------------------------------
# Agent can also create and manage the plan by itself, by calling the plan management tool functions.
# We just need to initialize the `ReActAgent` with the plan notebook as follows:
#

agent = ReActAgent(
    name="Friday",
    sys_prompt="You are a helpful assistant.",
    model=DashScopeChatModel(
        model_name="qwen-max",
        api_key=os.environ["DASHSCOPE_API_KEY"],
    ),
    formatter=DashScopeChatFormatter(),
    plan_notebook=PlanNotebook(),
)

# %%
# After that, we can build a loop to interact with the agent as follows.
# Once the task is complex, the agent will create a plan by itself and
# execute the plan step by step.
#
# .. code-block:: python
#     :caption: Build conversation with the plan agent
#
#     async def interact_with_agent() -> None:
#         """Interact with the plan agent."""
#         user = UserAgent(name="user")
#
#         msg = None
#         while True:
#             msg = await user(msg)
#             if msg.get_text_content() == "exit":
#                 break
#             msg = await agent(msg)
#
#     asyncio.run(interact_with_agent())
#
#
# Plan Visualization and Monitoring
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# AgentScope supports real-time visualization and monitoring of the plan
# execution by the plan change hook function.
#
# They will be triggered when the plan is changed by calling the tool
# functions. A template of the plan change hook function is as follows:
#


def plan_change_hook_template(self: PlanNotebook, plan: Plan) -> None:
    """A template of the plan change hook function.

    Args:
        self (`PlanNotebook`):
            The PlanNotebook instance.
        plan (`Plan`):
            The current plan instance (after the change).
    """
    # Forward the plan to the frontend for visualization or other processing



================================================
FILE: docs/tutorial/en/src/task_prompt.py
================================================
# -*- coding: utf-8 -*-
"""
.. _prompt:

Prompt Formatter
=========================

The formatter module in AgentScope is responsible for

- converting messages into the expected format for different LLM APIs,
- (optional) truncating messages to fit within token limits,
- (optional) prompt engineering, e.g. summarizing long conversations.

The last two are optional and can also be handled by developers within the memory or at the agent level.

In AgentScope, there are two types of formatters, "ChatFormatter" and "MultiAgentFormatter", distinguished by the agent identities in their input messages.

- **ChatFormatter**: Designed for standard user-assistant scenario (chatbot), using the ``role`` field to identify the user and assistant.
- **MultiAgentFormatter**: Designed for multi-agent scenario, use the ``name`` field to identify different agents, which will combine conversation history into a single user message dictionary.

The built-in formatters are listed below

.. list-table:: The built-in formatters in AgentScope
    :header-rows: 1

    * - API Provider
      - User-assistant Scenario
      - Multi-Agent Scenario
    * - OpenAI
      - ``OpenAIChatFormatter``
      - ``OpenAIMultiAgentFormatter``
    * - Anthropic
      - ``AnthropicChatFormatter``
      - ``AnthropicMultiAgentFormatter``
    * - DashScope
      - ``DashScopeChatFormatter``
      - ``DashScopeMultiAgentFormatter``
    * - Gemini
      - ``GeminiChatFormatter``
      - ``GeminiChatFormatter``
    * - Ollama
      - ``OllamaChatFormatter``
      - ``OllamaMultiAgentFormatter``
    * - DeepSeek
      - ``DeepSeekChatFormatter``
      - ``DeepSeekMultiAgentFormatter``
    * - vLLM
      - ``OpenAIChatFormatter``
      - ``OpenAIMultiAgentFormatter``

.. tip:: The OpenAI API supports the `name` field, so that `OpenAIChatFormatter` can also be used in multi-agent scenario. You can also use the `OpenAIMultiAgentFormatter` instead, which combine conversation history into a single user message.

Besides, the built-in formatters support to convert different message blocks into the expected format for the target API, which are list below:

.. list-table:: The supported message blocks in the built-in formatters
    :header-rows: 1

    * - Formatter
      - tool_use/result
      - image
      - audio
      - video
      - thinking
    * - ``OpenAIChatFormatter``
      - ✅
      - ✅
      - ✅
      - ❌
      -
    * - ``DashScopeChatFormatter``
      - ✅
      - ✅
      - ✅
      - ❌
      -
    * - ``DashScopeMultiAgentFormatter``
      - ✅
      - ✅
      - ✅
      - ❌
      -
    * - ``AnthropicChatFormatter``
      - ✅
      - ✅
      - ❌
      - ❌
      - ✅
    * - ``AnthropicMultiAgentFormatter``
      - ✅
      - ✅
      - ❌
      - ❌
      - ✅
    * - ``GeminiChatFormatter``
      - ✅
      - ✅
      - ✅
      - ✅
      -
    * - ``GeminiMultiAgentFormatter``
      - ✅
      - ✅
      - ✅
      - ✅
      -
    * - ``OllamaChatFormatter``
      - ✅
      - ✅
      - ❌
      - ❌
      -
    * - ``OllamaMultiAgentFormatter``
      - ✅
      - ✅
      - ❌
      - ❌
      -
    * - ``DeepSeekChatFormatter``
      - ✅
      - ❌
      - ❌
      - ❌
      -
    * - ``DeepSeekMultiAgentFormatter``
      - ✅
      - ❌
      - ❌
      - ❌
      -

.. note:: As stated in the `official documentation <https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking#preserving-thinking-blocks>`_, only Anthropic suggests to preserve the thinking blocks in prompt formatting. For the others, we just ignore the thinking blocks in the input messages.

ReAct-Oriented Formatting
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The built-in formatters are all designed to support ReAct-style agents, where the input messages **consist of alternating conversation history and tool call sequences**.

In user-assistant scenario, the conversation history includes the user and assistant messages, we just convert them into the expected format directly.
However, in multi-agent scenario, the conversation history is a list of messages from different agents as follows:

.. figure:: ../../_static/images/multiagent_msgs.png
    :alt: example of multiagent messages
    :width: 85%
    :align: center

    *Example of multi-agent messages*


Therefore, we have to merge the conversation history into a single user message with tags "<history>" and "</history>".
Taking DashScope as an example, the formatted message will look like this:
"""

from agentscope.token import HuggingFaceTokenCounter
from agentscope.formatter import DashScopeMultiAgentFormatter
from agentscope.message import Msg, ToolResultBlock, ToolUseBlock, TextBlock
import asyncio, json


input_msgs = [
    # System prompt
    Msg("system", "You're a helpful assistant named Friday", "system"),
    # Conversation history
    Msg("Bob", "Hi, Alice, do you know the nearest library?", "assistant"),
    Msg(
        "Alice",
        "Sorry, I don't know. Do you have any idea, Charlie?",
        "assistant",
    ),
    Msg(
        "Charlie",
        "No, let's ask Friday. Friday, get me the nearest library.",
        "assistant",
    ),
    # Tool sequence
    Msg(
        "Friday",
        [
            ToolUseBlock(
                type="tool_use",
                name="get_current_location",
                id="1",
                input={},
            ),
        ],
        "assistant",
    ),
    Msg(
        "system",
        [
            ToolResultBlock(
                type="tool_result",
                name="get_current_location",
                id="1",
                output=[TextBlock(type="text", text="104.48, 36.30")],
            ),
        ],
        "system",
    ),
    Msg(
        "Friday",
        [
            ToolUseBlock(
                type="tool_use",
                name="search_around",
                id="2",
                input={"location": [104.48, 36.30], "keyword": "library"},
            ),
        ],
        "assistant",
    ),
    Msg(
        "system",
        [
            ToolResultBlock(
                type="tool_result",
                name="search_around",
                id="2",
                output=[TextBlock(type="text", text="[...]")],
            ),
        ],
        "system",
    ),
    # Conversation history continues
    Msg("Friday", "The nearest library is ...", "assistant"),
    Msg("Bob", "Thanks, Friday!", "assistant"),
    Msg("Alice", "Let's go together.", "assistant"),
]


async def run_formatter_example() -> list[dict]:
    """Example of how to format multi-agent messages."""
    formatter = DashScopeMultiAgentFormatter()
    formatted_message = await formatter.format(input_msgs)
    print("The formatted message:")
    print(json.dumps(formatted_message, indent=4))
    return formatted_message


formatted_message = asyncio.run(run_formatter_example())

# %%
# Specifically, the conversation histories are formatted into:
#
print("The first conversation history:")
print(formatted_message[1]["content"])

print("\nThe second conversation history:")
print(formatted_message[-1]["content"])

# %%
# Truncation-based Formatting
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# With the token module in AgentScope, the built-in formatters support to truncate the input messages by **deleting the oldest messages** (except the system prompt message) when the token exceeds the limit.
#
# Taking OpenAIFormatter as an example, we first calculate the total number of tokens of the input messages.
#


async def run_token_counter() -> int:
    """Compute the token number of the input messages."""
    # We use huggingface token counter for dashscope models.
    token_counter = HuggingFaceTokenCounter(
        "Qwen/Qwen2.5-VL-3B-Instruct",
        use_mirror=False,
    )

    return await token_counter.count(formatted_message)


# %%
# Then we set the maximum token limit to 20 tokens less than the total number of tokens and run the formatter.
#


async def run_truncated_formatter() -> None:
    """Example of how to format messages with truncation."""
    token_counter = HuggingFaceTokenCounter(
        pretrained_model_name_or_path="Qwen/Qwen2.5-VL-3B-Instruct",
        use_mirror=False,
    )
    formatter = DashScopeMultiAgentFormatter(
        token_counter=token_counter,
        max_tokens=n_tokens - 20,
    )
    truncated_formatted_message = await formatter.format(input_msgs)
    n_truncated_tokens = await token_counter.count(truncated_formatted_message)
    print("The tokens after truncation: ", n_truncated_tokens)

    print("\nThe conversation history after truncation:")
    print(truncated_formatted_message[1]["content"])


# %%
# We can see the first two messages from Bob and Alice are removed to fit within the context length limits.
#
#
# Customizing Formatter
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# AgentScope provides two base classes ``FormatterBase`` and its child class ``TruncatedFormatterBase``.
# The ``TruncatedFormatterBase`` class provides the FIFO truncation strategy, and all the built-in formatters are inherited from it.
#
# .. list-table:: The base classes of formatters in AgentScope
#   :header-rows: 1
#
#   * - Class
#     - Abstract Method
#     - Description
#   * - ``FormatterBase``
#     - ``format``
#     - Format the input ``Msg`` objects into the expected format for the target API
#   * - ``TruncatedFormatterBase``
#     - ``_format_agent_message``
#     - Format the agent messages, which may contain multiple identities in multi-agent scenario
#   * -
#     - ``_format_tool_sequence``
#     - Format the tool use and result sequence into the expected format
#   * -
#     - ``_format`` (op